"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/tasks/task-modal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InteractiveCalendar } from "@/components/dashboard/interactive-calendar";
import { LineChartComponent, PieChartComponent } from "@/components/charts";
import { CalendarView } from "@/components/CalendarView";
import { Task, JournalEntry, TasksAPI, JournalAPI } from "@/lib/supabase/database";
import { useAuth } from "@/lib/supabase/auth-context";
import { useAssistantStore } from "@/components/ai/AssistantBubble";
import { AssistantStore } from '@/types/store';

export default function DashboardPage() {
  const { user } = useAuth();
  const setAssistantOpen = useAssistantStore((state: Pick<AssistantStore, 'setIsOpen'>) => state.setIsOpen);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate data for productivity chart based on tasks and journal entries
  const generateProductivityData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Count tasks completed on this day
      const tasksCompleted = tasks.filter(task => {
        const taskDate = task.updated_at ? new Date(task.updated_at) : null;
        return taskDate && 
               taskDate.getDate() === date.getDate() && 
               taskDate.getMonth() === date.getMonth() && 
               taskDate.getFullYear() === date.getFullYear() &&
               task.status === 'done';
      }).length;
      
      // Count journal entries for this day
      const entriesForDay = journalEntries.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getDate() === date.getDate() && 
               entryDate.getMonth() === date.getMonth() && 
               entryDate.getFullYear() === date.getFullYear();
      });
      
      // Calculate average mood if there are entries (scale 1-10)
      const moodSum = entriesForDay.reduce((sum, entry) => {
        if (entry.mood === 'happy') return sum + 10;
        if (entry.mood === 'neutral') return sum + 6;
        if (entry.mood === 'sad') return sum + 3;
        return sum;
      }, 0);
      
      const mood = entriesForDay.length > 0 ? moodSum / entriesForDay.length : 7;
      
      data.push({
        name: dayName,
        tasks: tasksCompleted,
        mood: Math.round(mood)
      });
    }
    
    return data;
  };
  
  // Generate data for journal topics based on actual entries
  const generateJournalTopicsData = () => {
    const allTags: string[] = [];
    
    // Collect all tags from journal entries
    journalEntries.forEach(entry => {
      if (entry.tags && Array.isArray(entry.tags)) {
        allTags.push(...entry.tags);
      }
    });
    
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // Convert to chart data format
    const data = Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Take top 5 topics
    
    // If no tags, return default data
    if (data.length === 0) {
      return [
        { name: "Work", value: 35 },
        { name: "Personal", value: 25 },
        { name: "Health", value: 20 },
        { name: "Ideas", value: 15 },
        { name: "Other", value: 5 },
      ];
    }
    
    return data;
  };
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch tasks
        const tasksData = await TasksAPI.getTasks(user.id);
        setTasks(tasksData);
        
        // Fetch journal entries
        const journalData = await JournalAPI.getEntries(user.id);
        setJournalEntries(journalData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Calculate stats
  const tasksDueToday = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate.getDate() === today.getDate() &&
           dueDate.getMonth() === today.getMonth() &&
           dueDate.getFullYear() === today.getFullYear() &&
           task.status !== 'done';
  }).length;
  
  const journalEntriesThisWeek = journalEntries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    return entryDate >= weekAgo;
  }).length;
  
  // Get recent tasks
  const recentTasks = tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date) : new Date(9999, 11, 31);
      const dateB = b.due_date ? new Date(b.due_date) : new Date(9999, 11, 31);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);
  
  // Get recent journal entries
  const recentJournalEntries = journalEntries
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2);
  
  // Sample data (now dynamically generated)
  const productivityData = generateProductivityData();
  const journalTopicsData = generateJournalTopicsData();

  // Function to open the assistant
  const openAssistant = () => {
    setAssistantOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 border-b-2 border-black dark:border-white pb-4">
        <h2 className="text-3xl font-bold uppercase">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-2 py-1 font-medium">
            Today is {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/tasks" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Tasks</CardTitle>
              <Icons.organize className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasksDueToday}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tasks remaining today</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/journal" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Journal</CardTitle>
              <Icons.journalIcon className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{journalEntriesThisWeek}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Journal entries this week</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/retrospect" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Reflections</CardTitle>
              <Icons.reflect className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : Math.max(1, Math.floor(journalEntries.length / 20))}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Monthly retrospective</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <InteractiveCalendar />
      </div>

      {/* Weekly Productivity Overview */}
      <div>
        <LineChartComponent
          title="Weekly Productivity"
          description="Task completion and mood rating for the past week"
          data={productivityData}
          dataKey="tasks"
          categories={["tasks", "mood"]}
          variant="brutal"
          height={250}
        />
      </div>

      {/* Google Calendar Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <CalendarView />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card variant="outline" className="border-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-bold">{task.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {task.due_date ? (
                            `Due ${new Date(task.due_date).toLocaleDateString()}`
                          ) : 'No due date'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No tasks available</p>
                  </div>
                )}
                <TaskModal />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card variant="outline" className="border-2">
          <CardHeader>
            <CardTitle>Journal Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ScrollArea className="h-60 pr-4">
                  <div className="space-y-4">
                    {recentJournalEntries.length > 0 ? (
                      recentJournalEntries.map(entry => (
                        <div key={entry.id} className="border-l-2 border-accent pl-4">
                          <p className="text-sm font-bold">"{entry.content.substring(0, 100)}..."</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No journal entries yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div className="col-span-1">
                <PieChartComponent
                  title=""
                  data={journalTopicsData}
                  innerRadius={40}
                  outerRadius={70}
                  variant="flat"
                  height={220}
                />
              </div>
              <div className="col-span-2">
                <Link href="/dashboard/journal">
                  <Button variant="accent" size="sm" className="w-full">New Journal Entry</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card variant="flat" className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold uppercase">Need Assistance?</h3>
            <p className="text-sm text-muted-foreground">Our AI assistant can help you stay productive and motivated.</p>
          </div>
          <Button 
            variant="brutalist" 
            size="lg" 
            className="border-2 border-black dark:border-white"
            onClick={openAssistant}
          >
            <Icons.brain className="mr-2 h-5 w-5" />
            Open Assistant
          </Button>
        </div>
      </Card>
    </div>
  );
} 