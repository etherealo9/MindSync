"use client";

import { useState } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIProvider, modifyJournal, modifyTask, modifyNote, queryHistory } from "@/lib/actions/ai-actions";
import { toast } from "sonner";

type AssistantHelperProps = {
  type: 'journal' | 'task' | 'note' | 'history';
  originalContent?: string;
  historyData?: any[];
  onResult?: (result: string) => void;
};

export default function AssistantHelper({ 
  type, 
  originalContent = '', 
  historyData = [],
  onResult 
}: AssistantHelperProps) {
  const [input, setInput] = useState("");
  const [action, setAction] = useState<'add' | 'modify'>(originalContent ? 'modify' : 'add');
  const [isLoading, setIsLoading] = useState(false);
  const [aiProvider, setAIProvider] = useState<AIProvider>("groq");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      let response = "";
      
      if (type === 'journal') {
        response = await modifyJournal(action, input, originalContent, aiProvider);
      } else if (type === 'task') {
        response = await modifyTask(action, input, originalContent, aiProvider);
      } else if (type === 'note') {
        response = await modifyNote(action, input, originalContent, aiProvider);
      } else if (type === 'history') {
        response = await queryHistory(input, historyData, aiProvider);
      }
      
      setResult(response);
      if (onResult) {
        onResult(response);
      }
      
      // Only clear input for history queries, leave it for add/modify
      if (type === 'history') {
        setInput("");
      }
      
      toast.success(`Successfully ${type === 'history' ? 'queried' : action === 'add' ? 'created' : 'modified'} ${type}`);
    } catch (error: any) {
      toast.error(`Failed to ${action} ${type}. Please try again.`);
      console.error(`AI ${type} ${action} error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'journal':
        return action === 'add' ? 'Add to Journal' : 'Modify Journal';
      case 'task':
        return action === 'add' ? 'Create Task' : 'Modify Task';
      case 'note':
        return action === 'add' ? 'Create Note' : 'Modify Note';
      case 'history':
        return 'Query History';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'journal':
        return action === 'add' 
          ? 'Add content to your journal with AI help.' 
          : 'Modify your journal with AI assistance.';
      case 'task':
        return action === 'add' 
          ? 'Create a new task with AI help.' 
          : 'Modify your task with AI assistance.';
      case 'note':
        return action === 'add' 
          ? 'Create a new note with AI help.' 
          : 'Modify your note with AI assistance.';
      case 'history':
        return 'Ask questions about your historical data.';
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'journal':
        return action === 'add' 
          ? 'What would you like to add to your journal?' 
          : 'How would you like to modify your journal entry?';
      case 'task':
        return action === 'add' 
          ? 'Describe the task you want to create.' 
          : 'How would you like to modify your task?';
      case 'note':
        return action === 'add' 
          ? 'Describe the note you want to create.' 
          : 'How would you like to modify your note?';
      case 'history':
        return 'Ask a question about your data history...';
      default:
        return '';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="space-y-1">
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {type !== 'history' && (
            <Select 
              value={action} 
              onValueChange={(value) => setAction(value as 'add' | 'modify')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add New</SelectItem>
                <SelectItem value="modify" disabled={!originalContent}>Modify</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Select 
            value={aiProvider} 
            onValueChange={(value) => setAIProvider(value as AIProvider)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="AI Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groq">Groq</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="huggingface">HuggingFace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={getPlaceholder()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full resize-none"
            rows={3}
            disabled={isLoading}
          />
          
          {originalContent && (
            <div className="mt-2 p-3 border rounded-md bg-muted/20">
              <div className="text-sm font-medium mb-1">Original Content:</div>
              <div className="text-sm whitespace-pre-wrap">{originalContent}</div>
            </div>
          )}
          
          {result && (
            <div className="mt-2 p-3 border rounded-md bg-primary/10">
              <div className="text-sm font-medium mb-1">Result:</div>
              <div className="text-sm whitespace-pre-wrap">{result}</div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Processing..." : type === 'history' ? "Query" : action === 'add' ? "Create" : "Modify"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 