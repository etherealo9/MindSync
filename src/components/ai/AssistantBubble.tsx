"use client";

import { useState, useEffect } from "react";
import { AIMessage } from "@/lib/ai/openai";
import { generateAIResponse, AIProvider, queryHistory } from "@/lib/actions/ai-actions";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TasksAPI, JournalAPI } from "@/lib/supabase/database";

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
  const [aiProvider, setAIProvider] = useState<AIProvider>("groq");
  const [currentProvider, setCurrentProvider] = useState<AIProvider | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  // Load user data for historical context
  useEffect(() => {
    if (user) {
      // Fetch tasks for history context
      TasksAPI.getTasks(user.id)
        .then(userTasks => {
          setTasks(userTasks);
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
      
      // Fetch journal entries for history context
      JournalAPI.getEntries(user.id)
        .then(entries => {
          setJournalEntries(entries);
        })
        .catch(error => {
          console.error("Error fetching journal entries:", error);
        });
    }
  }, [user]);

  // Helper function to detect intent from user message
  const detectIntent = (message: string): 'task' | 'journal' | 'note' | 'query' | 'general' => {
    const lowerCaseMessage = message.toLowerCase();
    
    // Task-related keywords
    const taskKeywords = [
      "create a task", "add a task", "make a task", "set a task", 
      "create task", "add task", "make task", "set task",
      "remind me to", "add to my todos", "add to my to-do",
      "schedule", "todo", "to-do", "to do", "task for"
    ];
    
    // Journal-related keywords
    const journalKeywords = [
      "create a journal", "add a journal", "write in my journal",
      "create journal", "add journal", "write journal",
      "journal entry", "diary entry", "record in journal"
    ];
    
    // Note-related keywords
    const noteKeywords = [
      "create a note", "add a note", "make a note", "take a note",
      "create note", "add note", "make note", "take note",
      "note down", "write down", "note this"
    ];
    
    // Query-related keywords
    const queryKeywords = [
      "how many tasks", "what tasks", "show me tasks", "find tasks",
      "search for", "look up", "find entries", "show me entries",
      "what did i", "when did i", "analysis of", "analyze my",
      "summary of", "summarize", "show me historical", "history of"
    ];
    
    // Check for intents in priority order
    if (taskKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return 'task';
    } else if (journalKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return 'journal';
    } else if (noteKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return 'note';
    } else if (queryKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return 'query';
    }
    
    return 'general';
  };

  // Function to create a task
  const createTask = async (userMessage: string, aiResponse: string) => {
    if (!user) return false;
    
    try {
      const title = aiResponse.split('\n')[0].trim().substring(0, 100) || 'Task from Assistant';
      
      const newTask = await TasksAPI.createTask({
        user_id: user.id,
        title: title,
        description: aiResponse,
        priority: "medium",
        status: "todo",
        due_date: new Date().toISOString().split('T')[0] // Today's date as default
      });
      
      // Fetch tasks again to ensure the UI is updated
      const updatedTasks = await TasksAPI.getTasks(user.id);
      setTasks(updatedTasks);
      
      // Notify the user that a task was created
      toast.success("Task created successfully");
      
      // Add a system message confirming task creation
      const systemMessage: AIMessage = {
        role: "system",
        content: `✅ Task "${title}" has been added to your tasks list.`,
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      return true;
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      return false;
    }
  };

  // Function to create a journal entry
  const createJournalEntry = async (userMessage: string, aiResponse: string) => {
    if (!user) return false;
    
    try {
      const title = aiResponse.split('\n')[0].trim().substring(0, 100) || 'Journal from Assistant';
      
      const newEntry = await JournalAPI.createEntry({
        user_id: user.id,
        title: title,
        content: aiResponse,
        mood: "neutral",
        tags: ["ai-generated"]
      });
      
      // Fetch journal entries again to update our local state
      const updatedEntries = await JournalAPI.getEntries(user.id);
      setJournalEntries(updatedEntries);
      
      // Notify the user that a journal entry was created
      toast.success("Journal entry created successfully");
      
      // Add a system message confirming journal creation
      const systemMessage: AIMessage = {
        role: "system",
        content: `✅ Journal entry "${title}" has been added.`,
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      return true;
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to create journal entry");
      return false;
    }
  };

  // Function to create a note (using TasksAPI with low priority)
  const createNote = async (userMessage: string, aiResponse: string) => {
    if (!user) return false;
    
    try {
      const title = aiResponse.split('\n')[0].trim().substring(0, 100) || 'Note from Assistant';
      
      const newNote = await TasksAPI.createTask({
        user_id: user.id,
        title: title,
        description: aiResponse,
        priority: "low", // Using low priority to indicate it's a note
        status: "todo",
        due_date: new Date().toISOString().split('T')[0] // Today's date as default
      });
      
      // Fetch tasks again to ensure the UI is updated
      const updatedTasks = await TasksAPI.getTasks(user.id);
      setTasks(updatedTasks);
      
      // Notify the user that a note was created
      toast.success("Note created successfully");
      
      // Add a system message confirming note creation
      const systemMessage: AIMessage = {
        role: "system",
        content: `✅ Note "${title}" has been added.`,
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      return true;
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
      return false;
    }
  };
  
  // Function to query historical data
  const queryUserHistory = async (userMessage: string) => {
    if (!user) return false;
    
    try {
      // Prepare historical data for the AI
      const historicalData = [
        {
          type: 'tasks',
          data: tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date,
            created_at: task.created_at
          }))
        },
        {
          type: 'journal',
          data: journalEntries.map(entry => ({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            tags: entry.tags,
            created_at: entry.created_at
          }))
        }
      ];
      
      // Query the historical data
      const response = await queryHistory(
        userMessage,
        historicalData,
        aiProvider
      );
      
      // Add an assistant message with the historical data response
      const assistantMessage: AIMessage = {
        role: "assistant",
        content: response,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      return true;
    } catch (error) {
      console.error("Error querying historical data:", error);
      toast.error("Failed to query historical data");
      return false;
    }
  };

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
      // Enhanced system prompt that explains all the capabilities
      const systemPrompt: AIMessage = {
        role: "system",
        content: "You are MindSync AI assistant, designed to help users with productivity, task management, and journaling. Be concise, helpful, and friendly. You can:\n" +
        "1. Create tasks - When a user asks to create a task, respond with a well-formatted task. Start with a clear title in the first line.\n" +
        "2. Create journal entries - When a user wants to journal, respond with a well-formatted journal entry.\n" +
        "3. Create notes - When a user asks to create a note, respond with well-formatted note content.\n" +
        "4. Access historical data - When a user asks about their history, you can provide information about their past tasks and journal entries.\n" +
        "Format your responses clearly and concisely. Each response will be processed based on detected intent.",
      };
      
      // Detect the intent of the user's message
      const intent = detectIntent(input);
      
      // Special handling for historical queries
      if (intent === 'query') {
        // Add the user message to the conversation
        setMessages(prev => [...prev, userMessage]);
        
        // Query historical data directly
        const success = await queryUserHistory(input);
        setIsLoading(false);
        
        if (success) {
          // Add a notification
          NotificationsAPI.addNotification(
            "system",
            "AI History Query",
            "Your AI assistant has analyzed your historical data",
            false
          );
        }
        
        return;
      }
      
      // Regular AI completion for other intents
      const fullMessageHistory: AIMessage[] = [
        systemPrompt,
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
      
      // Handle different actions based on intent
      let success = false;
      
      switch (intent) {
        case 'task':
          success = await createTask(userMessage.content, response.content);
          break;
        case 'journal':
          success = await createJournalEntry(userMessage.content, response.content);
          break;
        case 'note':
          success = await createNote(userMessage.content, response.content);
          break;
        default:
          // No special action needed for general conversation
          success = true;
          break;
      }
      
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
                    <div className="text-xs mt-2 text-center text-gray-400 space-y-1">
                      <p>Tip: You can ask me to:</p>
                      <p>• Create tasks</p>
                      <p>• Add journal entries</p>
                      <p>• Take notes</p>
                      <p>• Query your history</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary/10 ml-auto"
                            : message.role === "system"
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-muted"
                        } max-w-[80%] ${
                          message.role === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div className="font-medium mb-1 text-xs">
                          {message.role === "user" ? "You" : 
                           message.role === "system" ? "System" : "Assistant"}
                          {index > 0 && message.role === "assistant" && currentProvider && (
                            <span className="text-xs ml-2 text-gray-500">
                              via {
                                currentProvider === 'openai' ? 'OpenAI' : 
                                currentProvider === 'groq' ? 'Groq' : 'HuggingFace'
                              }
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
            <CardFooter className="p-4 pt-0">
              <form onSubmit={handleSubmit} className="w-full space-y-2">
                <Textarea
                  placeholder={isConfigured ? "Type your message here..." : "AI Assistant unavailable"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full resize-none text-sm"
                  rows={2}
                  disabled={isLoading || !isConfigured}
                />
                <div className="flex justify-between">
                  <Select
                    value={aiProvider}
                    onValueChange={(value) => setAIProvider(value as AIProvider)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="huggingface">HuggingFace</SelectItem>
                    </SelectContent>
                  </Select>
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