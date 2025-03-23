import OpenAI from 'openai';

// IMPORTANT: This client-side implementation is deprecated.
// Please use the server actions in @/lib/actions/ai-actions.ts instead.
// This file is kept for backward compatibility.

// Check for browser environment and use NEXT_PUBLIC_ prefixed variables for client components
const getApiKey = () => {
  // Use a fallback mechanism for client-side
  if (typeof window !== 'undefined') {
    // In client-side, we need to use NEXT_PUBLIC_ prefixed vars
    return process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  }
  // Server-side can access non-public env vars
  return process.env.OPENAI_API_KEY || '';
};

const createOpenAIClient = () => {
  const apiKey = getApiKey();
  
  // Return a dummy client if no API key is available
  if (!apiKey) {
    console.warn('OpenAI API key is missing. Some features will not work.');
    return {
      chat: {
        completions: {
          create: async () => {
            throw new Error(
              'OpenAI API key is missing. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.'
            );
          },
        },
      },
    } as unknown as OpenAI;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
};

const openai = createOpenAIClient();

export type AIResponse = {
  content: string;
  id: string;
};

export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const OpenAIService = {
  // Check if OpenAI is properly configured
  isConfigured: () => {
    return !!getApiKey();
  },

  // Generate a text response using the OpenAI API
  generateResponse: async (messages: AIMessage[]): Promise<AIResponse> => {
    try {
      if (!OpenAIService.isConfigured()) {
        return {
          content: "Sorry, the AI assistant is not available at the moment. The API key is missing.",
          id: "error-missing-key",
        };
      }
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const message = response.choices[0].message;

      return {
        content: message.content || '',
        id: response.id,
      };
    } catch (error: any) {
      console.error("OpenAI API Error:", error);
      return {
        content: `Sorry, there was an error with the AI service: ${error.message}`,
        id: "error",
      };
    }
  },

  // Generate journal analysis
  analyzeJournal: async (journalText: string): Promise<string> => {
    if (!OpenAIService.isConfigured()) {
      return "AI analysis is not available. Please check your OpenAI API key configuration.";
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
      const response = await OpenAIService.generateResponse(messages);
      return response.content;
    } catch (error) {
      console.error("Journal analysis error:", error);
      return "Sorry, there was an error analyzing your journal entry.";
    }
  },

  // Generate task suggestions based on current tasks
  suggestTasks: async (currentTasks: string[]): Promise<string[]> => {
    if (!OpenAIService.isConfigured()) {
      return ["AI task suggestions are not available. Please check your OpenAI API key configuration."];
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
      const response = await OpenAIService.generateResponse(messages);
      
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