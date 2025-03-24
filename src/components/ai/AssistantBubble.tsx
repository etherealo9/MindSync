"use client";

import { useState, useEffect } from "react";
import { AIMessage } from "@/lib/ai/openai";
import { generateAIResponse, AIProvider } from "@/lib/actions/ai-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { NotificationsAPI } from "@/lib/utils/notifications";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/supabase/auth-context";
import { create } from 'zustand';
import { AssistantStore } from '@/types/store';

// Create a store for controlling the assistant bubble
// This is exported so it can be used across the application
export const useAssistantStore = create<AssistantStore>((set: any) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

export default function AssistantBubble() {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useAssistantStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const [aiProvider, setAIProvider] = useState<AIProvider>("openai");
  const [currentProvider, setCurrentProvider] = useState<AIProvider | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: AIMessage = {
      role: "user",
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Create a full message history including a system prompt
      const fullMessageHistory: AIMessage[] = [
        {
          role: "system",
          content: "You are MindSync AI assistant, designed to help users with productivity, task management, and journaling. Be concise, helpful, and friendly.",
        },
        ...messages,
        userMessage,
      ];
      
      const response = await generateAIResponse(fullMessageHistory, aiProvider);
      
      // Store the provider that was actually used
      setCurrentProvider(response.provider);
      
      // Check if there was an error
      if (response.id.startsWith('error')) {
        toast.error(response.content);
        setIsConfigured(false);
        return;
      }
      
      const assistantMessage: AIMessage = {
        role: "assistant",
        content: response.content,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add a notification
      NotificationsAPI.addNotification(
        "system",
        "AI Assistant Response",
        "Your AI assistant has responded to your query",
        false
      );
    } catch (error: any) {
      toast.error("Failed to get AI response. Please try again.");
      console.error("AI response error:", error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0"
            onClick={() => setIsOpen(true)}
          >
            <Icons.bot size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end" sideOffset={16}>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="h-[300px] overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Icons.bot size={32} className="mb-2" />
                    <p className="text-sm">How can I help you today?</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary/10 ml-auto"
                            : "bg-muted"
                        } max-w-[80%] ${
                          message.role === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div className="font-medium mb-1 text-xs">
                          {message.role === "user" ? "You" : "Assistant"}
                          {index > 0 && index % 2 === 1 && currentProvider && (
                            <span className="text-xs ml-2 text-gray-500">
                              via {currentProvider === 'openai' ? 'OpenAI' : 'HuggingFace'}
                            </span>
                          )}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="p-3 rounded-lg bg-muted max-w-[80%] mr-auto">
                        <div className="font-medium mb-1 text-xs">Assistant</div>
                        <div className="text-sm">Thinking...</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t">
              <form onSubmit={handleSubmit} className="w-full space-y-2">
                <Textarea
                  placeholder={isConfigured ? "Type your message here..." : "AI Assistant unavailable"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full resize-none text-sm"
                  rows={2}
                  disabled={isLoading || !isConfigured}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={isLoading || !input.trim() || !isConfigured}
                  >
                    {isLoading ? "Thinking..." : "Send"}
                  </Button>
                </div>
              </form>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
} 