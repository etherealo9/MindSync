"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { LineChartComponent, PieChartComponent, AreaChartComponent } from "@/components/charts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Journal entry type definition
type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: "happy" | "neutral" | "sad";
  tags?: string[];
};

export default function JournalPage() {
  // Sample journal entries data
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Project Progress",
      content: "Today I made significant progress on the new feature implementation. Feeling more confident about meeting the deadline.",
      date: "2025-03-22",
      mood: "happy",
      tags: ["work", "coding"],
    },
    {
      id: "2",
      title: "Client Meeting",
      content: "Meeting with the client went well. We clarified requirements and set expectations for the project timeline.",
      date: "2025-03-21",
      mood: "neutral",
      tags: ["work", "client"],
    },
    {
      id: "3",
      title: "Technical Challenges",
      content: "Faced some technical challenges with the database integration. Need to research more tomorrow.",
      date: "2025-03-20",
      mood: "sad",
      tags: ["work", "challenge"],
    },
  ]);

  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryMood, setNewEntryMood] = useState<"happy" | "neutral" | "sad">("neutral");
  const [newEntryTags, setNewEntryTags] = useState<string>("");

  // Sample data for journal analytics
  const moodTrendData = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: Math.floor(Math.random() * 3) + 1, // 1: sad, 2: neutral, 3: happy
      wordCount: Math.floor(Math.random() * 300) + 100,
    };
  });

  const tagDistributionData = [
    { name: "work", value: entries.filter(e => e.tags?.includes("work")).length },
    { name: "personal", value: entries.filter(e => e.tags?.includes("personal")).length },
    { name: "health", value: entries.filter(e => e.tags?.includes("health")).length },
    { name: "coding", value: entries.filter(e => e.tags?.includes("coding")).length },
    { name: "challenge", value: entries.filter(e => e.tags?.includes("challenge")).length },
  ].filter(item => item.value > 0);

  const moodDistributionData = [
    { name: "Happy", value: entries.filter(e => e.mood === "happy").length },
    { name: "Neutral", value: entries.filter(e => e.mood === "neutral").length },
    { name: "Sad", value: entries.filter(e => e.mood === "sad").length },
  ];

  // Add new journal entry
  const addEntry = () => {
    if (newEntryTitle.trim() === "" || newEntryContent.trim() === "") return;
    
    const tagsArray = newEntryTags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntryTitle,
      content: newEntryContent,
      date: new Date().toISOString().split("T")[0],
      mood: newEntryMood,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };
    
    setEntries([newEntry, ...entries]);
    setNewEntryTitle("");
    setNewEntryContent("");
    setNewEntryMood("neutral");
    setNewEntryTags("");
  };

  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500 h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        );
      case "sad":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" x2="16" y1="15" y2="15" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500 h-5 w-5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" x2="16" y1="12" y2="12" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h2 className="text-2xl font-bold">Journal</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Journal Entry</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
              <DialogDescription>
                Document your thoughts, experiences, and reflections to track your journey and personal growth.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="entry-title">Entry Title</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Give your journal entry a meaningful title that summarizes the main topic.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="entry-title"
                  placeholder="E.g., 'Morning Reflection' or 'Project Milestone'"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">A clear title helps you find this entry later.</p>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="entry-content">Journal Content</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Write freely about your thoughts, experiences, challenges, or achievements.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <textarea
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="entry-content"
                  placeholder="Detail your thoughts, experiences, or reflections here... What happened today? How did you feel about it? What did you learn?"
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Be honest and detailed - this is your personal space for reflection.</p>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="entry-tags">Tags</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add comma-separated tags to categorize and easily find your entries later.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="entry-tags"
                  placeholder="work, personal, idea, health, goal (comma-separated)"
                  value={newEntryTags}
                  onChange={(e) => setNewEntryTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Tags help organize entries and identify patterns in your journaling.</p>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label>Emotional State</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the mood that best represents your emotional state for this entry.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={newEntryMood === "happy" ? "default" : "outline"}
                    onClick={() => setNewEntryMood("happy")}
                    className="flex items-center justify-center gap-2"
                  >
                    {getMoodIcon("happy")} Positive
                  </Button>
                  <Button
                    type="button"
                    variant={newEntryMood === "neutral" ? "default" : "outline"}
                    onClick={() => setNewEntryMood("neutral")}
                    className="flex items-center justify-center gap-2"
                  >
                    {getMoodIcon("neutral")} Neutral
                  </Button>
                  <Button
                    type="button"
                    variant={newEntryMood === "sad" ? "default" : "outline"}
                    onClick={() => setNewEntryMood("sad")}
                    className="flex items-center justify-center gap-2"
                  >
                    {getMoodIcon("sad")} Challenging
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Tracking your mood helps identify emotional patterns over time.</p>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={addEntry} className="w-full sm:w-auto">Create Entry</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Journal and Insights Tabs */}
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        {/* Journal Entries Tab Content */}
        <TabsContent value="journal" className="space-y-6">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                      {entry.tags && entry.tags.length > 0 && (
                        <span className="ml-2">
                          {entry.tags.map((tag, i) => (
                            <span key={i} className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full mr-1">
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </p>
                  </div>
                  <div>{getMoodIcon(entry.mood)}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Insights Tab Content */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mood Trends</CardTitle>
                <CardDescription>Your emotional journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartComponent
                  title=""
                  data={moodTrendData}
                  dataKey="mood"
                  categories={["mood"]}
                  variant="brutal"
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tag Distribution</CardTitle>
                <CardDescription>Most common journal topics</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  title=""
                  data={tagDistributionData}
                  variant="brutal"
                  innerRadius={0}
                  outerRadius={70}
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mood Distribution</CardTitle>
                <CardDescription>Overall emotional balance</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  title=""
                  data={moodDistributionData}
                  variant="brutal"
                  innerRadius={0}
                  outerRadius={70}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Journal Insights</CardTitle>
              <CardDescription>Patterns and recommendations based on your entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Mood Analysis</h4>
                <p className="text-sm">
                  {moodDistributionData[0].value > moodDistributionData[2].value ? 
                    "Your journal reflects a generally positive mood. Keep building on these positive experiences!" : 
                    "Your journal shows some challenging experiences. Consider reflecting on what brings you joy and incorporating more of those activities."}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Topic Focus</h4>
                <p className="text-sm">
                  Your most frequent journal topic is 
                  "{tagDistributionData.sort((a, b) => b.value - a.value)[0]?.name || 'work'}". 
                  Consider whether this balance aligns with your priorities.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Journaling Consistency</h4>
                <p className="text-sm">
                  You've created {entries.length} entries recently. 
                  {entries.length > 10 ? 
                    "Excellent consistency! Regular journaling helps build self-awareness." : 
                    "Consider setting a regular time for journaling to build this helpful habit."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 