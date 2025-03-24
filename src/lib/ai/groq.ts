import { Message } from 'ai';
import Groq from 'groq-sdk';

// Get Groq API key from environment variables
const getGroqApiKey = () => {
  // Server-side can access non-public env vars
  return process.env.GROQ_API_KEY || '';
};

// Define a Groq model to use
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Convert AIMessage format to AI SDK's Message format
export const convertToAISDKMessages = (messages: AIMessage[]): Message[] => {
  return messages.map(msg => ({
    id: `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    role: msg.role,
    content: msg.content,
  }));
};

// Import AIMessage type from our existing code
export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type AIResponse = {
  content: string;
  id: string;
  provider?: 'groq';
};

export const GroqService = {
  // Check if Groq is properly configured
  isConfigured: () => {
    return !!getGroqApiKey();
  },

  // Generate a text response using the Groq API
  generateResponse: async (messages: AIMessage[]): Promise<AIResponse> => {
    try {
      if (!GroqService.isConfigured()) {
        return {
          content: "Sorry, the AI assistant is not available at the moment. The Groq API key is missing.",
          id: "error-missing-key",
          provider: "groq"
        };
      }
      
      // Convert messages to the format expected by Groq API
      const groqMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Create a client
      const client = new Groq({
        apiKey: getGroqApiKey(),
      });
      
      // Call the Groq API
      const response = await client.chat.completions.create({
        model: GROQ_MODEL,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        content: response.choices[0].message.content || '',
        id: response.id,
        provider: "groq"
      };
    } catch (error: any) {
      console.error("Groq API Error:", error);
      return {
        content: `Sorry, there was an error with the Groq service: ${error.message}`,
        id: "error",
        provider: "groq"
      };
    }
  },
}; 