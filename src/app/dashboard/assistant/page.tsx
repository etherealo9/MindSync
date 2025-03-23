"use client";

import { useState, useEffect } from "react";
import { AIMessage } from "@/lib/ai/openai";
import { generateAIResponse } from "@/lib/actions/ai-actions";
import { useAuth } from "@/lib/supabase/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { NotificationsAPI } from "@/lib/utils/notifications";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AssistantPage() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);

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
      
      // Use the server action instead of the client service
      const response = await generateAIResponse(fullMessageHistory);
      
      // Check if there was an error
      if (response.id.startsWith('error')) {
        toast.error(response.content);
        setIsConfigured(false); // Set this to show the config error message
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
      setIsConfigured(false); // Set this to show the config error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
        
        {!isConfigured && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>
              The OpenAI API key is missing or invalid. Please add OPENAI_API_KEY to your .env.local file.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How can I help you today?</CardTitle>
            <CardDescription>
              Ask me about task management, journaling tips, productivity advice, or anything else!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[400px] overflow-y-auto p-4 border rounded-md">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Icons.bot size={48} className="mb-2" />
                  <p>No messages yet. Start a conversation!</p>
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
                      <div className="font-medium mb-1">
                        {message.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-3 rounded-lg bg-muted max-w-[80%] mr-auto">
                      <div className="font-medium mb-1">Assistant</div>
                      <div className="text-sm">Thinking...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="w-full space-y-2">
              <Textarea
                placeholder={isConfigured ? "Type your message here..." : "AI Assistant unavailable - API key missing"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full resize-none"
                rows={3}
                disabled={isLoading || !isConfigured}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !input.trim() || !isConfigured}>
                  {isLoading ? "Thinking..." : "Send"}
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>What can I help with?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Task management strategies and tips</li>
              <li>Journal prompts and reflection ideas</li>
              <li>Productivity techniques and advice</li>
              <li>Habit formation and goal setting</li>
              <li>Work-life balance suggestions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 