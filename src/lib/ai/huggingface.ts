import { HfInference } from '@huggingface/inference';
import { AIMessage, AIResponse } from './openai';

// Check for browser environment and use NEXT_PUBLIC_ prefixed variables for client components
const getApiKey = () => {
  // Use a fallback mechanism for client-side
  if (typeof window !== 'undefined') {
    // In client-side, we need to use NEXT_PUBLIC_ prefixed vars
    return process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '';
  }
  // Server-side can access non-public env vars
  return process.env.HUGGINGFACE_API_KEY || '';
};

const createHuggingFaceClient = () => {
  const apiKey = getApiKey();
  
  // Return a dummy client if no API key is available
  if (!apiKey) {
    console.warn('HuggingFace API key is missing. Some features will not work.');
    return null;
  }
  
  return new HfInference(apiKey);
};

const hf = createHuggingFaceClient();

// Default model to use
const DEFAULT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

export const HuggingFaceService = {
  // Check if HuggingFace is properly configured
  isConfigured: () => {
    return !!getApiKey();
  },

  // Generate a text response using the HuggingFace API
  generateResponse: async (messages: AIMessage[]): Promise<AIResponse> => {
    try {
      if (!HuggingFaceService.isConfigured() || !hf) {
        return {
          content: "Sorry, the AI assistant is not available at the moment. The HuggingFace API key is missing.",
          id: "error-missing-key",
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
        model: DEFAULT_MODEL,
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
      };
    } catch (error: any) {
      console.error("HuggingFace API Error:", error);
      return {
        content: `Sorry, there was an error with the AI service: ${error.message}`,
        id: "error",
      };
    }
  },

  // Generate journal analysis
  analyzeJournal: async (journalText: string): Promise<string> => {
    if (!HuggingFaceService.isConfigured()) {
      return "AI analysis is not available. Please check your HuggingFace API key configuration.";
    }
    
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
      const response = await HuggingFaceService.generateResponse(messages);
      return response.content;
    } catch (error) {
      console.error("Journal analysis error:", error);
      return "Sorry, there was an error analyzing your journal entry.";
    }
  },

  // Generate task suggestions based on current tasks
  suggestTasks: async (currentTasks: string[]): Promise<string[]> => {
    if (!HuggingFaceService.isConfigured()) {
      return ["AI task suggestions are not available. Please check your HuggingFace API key configuration."];
    }
    
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
      const response = await HuggingFaceService.generateResponse(messages);
      
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
  },
}; 