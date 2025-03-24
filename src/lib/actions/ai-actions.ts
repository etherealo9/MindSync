'use server';

import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import { AIMessage } from '@/lib/ai/openai';
import { GroqService } from '@/lib/ai/groq';

// Server-side OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Server-side HuggingFace client
const hf = process.env.HUGGINGFACE_API_KEY ? new HfInference(process.env.HUGGINGFACE_API_KEY) : null;

// Default HuggingFace model to use
const DEFAULT_HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

export type AIResponse = {
  content: string;
  id: string;
  provider?: 'openai' | 'huggingface' | 'groq';
};

export type AIProvider = 'openai' | 'huggingface' | 'groq';

// Function to determine which AI provider to use
function getAIProvider(): AIProvider {
  // If Groq is available, prefer it
  if (process.env.GROQ_API_KEY) {
    return 'groq';
  }
  // Then try OpenAI
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  // Otherwise use HuggingFace if available
  if (process.env.HUGGINGFACE_API_KEY && hf) {
    return 'huggingface';
  }
  // Default to OpenAI
  return 'openai';
}

export async function generateAIResponse(
  messages: AIMessage[], 
  provider?: AIProvider
): Promise<AIResponse> {
  // Use specified provider or auto-detect
  const actualProvider = provider || getAIProvider();
  
  // Try the specified provider first
  if (actualProvider === 'groq') {
    try {
      const response = await GroqService.generateResponse(messages);
      return response;
    } catch (error: any) {
      console.error("Groq API Error:", error);
      
      // Fall back to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        console.log('Falling back to OpenAI due to Groq error');
        return generateOpenAIResponse(messages);
      }
      
      return {
        content: `Sorry, there was an error with the Groq service: ${error.message}`,
        id: "error",
        provider: "groq"
      };
    }
  } else if (actualProvider === 'huggingface') {
    try {
      if (!process.env.HUGGINGFACE_API_KEY || !hf) {
        // Fall back to OpenAI if available
        if (process.env.OPENAI_API_KEY) {
          console.log('Falling back to OpenAI because HuggingFace is not configured');
          return generateOpenAIResponse(messages);
        }
        
        return {
          content: "HuggingFace API key is not configured. Please add a valid API key to your environment variables.",
          id: "error-missing-key",
          provider: "huggingface"
        };
      }
      
      // Format messages for the text generation API
      // This constructs a prompt in the format that Mistral models expect
      let formattedPrompt = '';
      for (const message of messages) {
        if (message.role === 'system') {
          formattedPrompt += `<s>[INST] ${message.content} [/INST]</s>\n`;
        } else if (message.role === 'user') {
          formattedPrompt += `<s>[INST] ${message.content} [/INST]</s>\n`;
        } else if (message.role === 'assistant') {
          formattedPrompt += `<s>${message.content}</s>\n`;
        }
      }

      const response = await hf.textGeneration({
        model: DEFAULT_HF_MODEL,
        inputs: formattedPrompt.trim(),
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        }
      });

      return {
        content: response.generated_text || '',
        id: `hf-${Date.now()}`, // HF doesn't provide response IDs, so we create one
        provider: 'huggingface'
      };
    } catch (error: any) {
      console.error("HuggingFace API Error:", error);
      
      // Fall back to OpenAI if available
      if (process.env.OPENAI_API_KEY) {
        console.log('Falling back to OpenAI due to HuggingFace error');
        return generateOpenAIResponse(messages);
      }
      
      return {
        content: `Sorry, there was an error with the HuggingFace service: ${error.message}`,
        id: "error",
        provider: "huggingface"
      };
    }
  } else {
    // Use OpenAI
    return generateOpenAIResponse(messages);
  }
}

// Private function to use OpenAI API
async function generateOpenAIResponse(messages: AIMessage[]): Promise<AIResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        content: "OpenAI API key is not configured. Please add a valid API key to your environment variables or settings page.",
        id: "error-missing-key",
        provider: "openai"
      };
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const message = response.choices[0].message;

    return {
      content: message.content || '',
      id: response.id,
      provider: "openai"
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return {
      content: `Sorry, there was an error with the OpenAI service: ${error.message}`,
      id: "error",
      provider: "openai"
    };
  }
}

// Generate journal analysis
export async function analyzeJournal(journalText: string, provider?: AIProvider): Promise<string> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that provides insightful analysis of journal entries. Identify key themes, emotions, and provide constructive feedback.',
    },
    {
      role: 'user',
      content: `Please analyze this journal entry: ${journalText}`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    return response.content;
  } catch (error) {
    console.error("Journal analysis error:", error);
    return "Sorry, there was an error analyzing your journal entry.";
  }
}

// Generate task suggestions based on current tasks
export async function suggestTasks(currentTasks: string[], provider?: AIProvider): Promise<string[]> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that provides task suggestions based on existing tasks. Suggest 3-5 related or follow-up tasks that might be relevant.',
    },
    {
      role: 'user',
      content: `Here are my current tasks: ${currentTasks.join(', ')}. Please suggest some additional tasks I might consider.`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    
    // Simple parsing - split by numbered list items
    const suggestions = response.content
      .split(/\d+\.\s+/)
      .slice(1) // Remove the first empty element
      .map(item => item.trim())
      .filter(Boolean);
    
    return suggestions.length > 0 ? suggestions : ["No task suggestions available at the moment."];
  } catch (error) {
    console.error("Task suggestion error:", error);
    return ["Sorry, there was an error generating task suggestions."];
  }
}

// Add/modify content in journals
export async function modifyJournal(
  action: 'add' | 'modify', 
  content: string,
  originalContent?: string,
  provider?: AIProvider
): Promise<string> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an assistant that helps ${action} content to journal entries. Be concise and helpful.`,
    },
    {
      role: 'user',
      content: action === 'add' 
        ? `Please add the following to my journal: ${content}`
        : `Please modify this journal entry: "${originalContent}" with these changes: ${content}`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    return response.content;
  } catch (error) {
    console.error(`Journal ${action} error:`, error);
    return `Sorry, there was an error ${action === 'add' ? 'adding to' : 'modifying'} your journal entry.`;
  }
}

// Add/modify tasks
export async function modifyTask(
  action: 'add' | 'modify',
  content: string,
  originalTask?: string,
  provider?: AIProvider
): Promise<string> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an assistant that helps ${action} tasks. Format tasks clearly and concisely.`,
    },
    {
      role: 'user',
      content: action === 'add' 
        ? `Please create a new task based on this description: ${content}`
        : `Please modify this task: "${originalTask}" with these changes: ${content}`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    return response.content;
  } catch (error) {
    console.error(`Task ${action} error:`, error);
    return `Sorry, there was an error ${action === 'add' ? 'adding' : 'modifying'} your task.`;
  }
}

// Add/modify notes
export async function modifyNote(
  action: 'add' | 'modify',
  content: string,
  originalNote?: string,
  provider?: AIProvider
): Promise<string> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are an assistant that helps ${action} notes. Format notes clearly and concisely.`,
    },
    {
      role: 'user',
      content: action === 'add' 
        ? `Please create a new note based on this description: ${content}`
        : `Please modify this note: "${originalNote}" with these changes: ${content}`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    return response.content;
  } catch (error) {
    console.error(`Note ${action} error:`, error);
    return `Sorry, there was an error ${action === 'add' ? 'adding' : 'modifying'} your note.`;
  }
}

// Query historical data
export async function queryHistory(query: string, historyData: any[], provider?: AIProvider): Promise<string> {
  const actualProvider = provider || getAIProvider();
  
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'You are an assistant that helps analyze historical data. Provide clear, concise answers based on the data provided.',
    },
    {
      role: 'user',
      content: `Based on this historical data: ${JSON.stringify(historyData)}, please answer: ${query}`,
    },
  ];

  try {
    const response = await generateAIResponse(messages, actualProvider);
    return response.content;
  } catch (error) {
    console.error("History query error:", error);
    return "Sorry, there was an error querying your historical data.";
  }
} 