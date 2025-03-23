'use server';

import OpenAI from 'openai';
import { AIMessage } from '@/lib/ai/openai';

// Server-side OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type AIResponse = {
  content: string;
  id: string;
};

export async function generateAIResponse(messages: AIMessage[]): Promise<AIResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
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
}

// Generate journal analysis
export async function analyzeJournal(journalText: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
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
    const response = await generateAIResponse(messages);
    return response.content;
  } catch (error) {
    console.error("Journal analysis error:", error);
    return "Sorry, there was an error analyzing your journal entry.";
  }
}

// Generate task suggestions based on current tasks
export async function suggestTasks(currentTasks: string[]): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) {
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
    const response = await generateAIResponse(messages);
    
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