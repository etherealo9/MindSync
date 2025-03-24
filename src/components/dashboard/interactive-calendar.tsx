"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Task, JournalEntry, TasksAPI, JournalAPI } from "@/lib/supabase/database";
import { useAuth } from "@/lib/supabase/auth-context";
import { toast } from "sonner";

// Define valid priority and status values
type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "todo" | "in_progress" | "done";

interface Event {
  id?: string;
  title: string;
  description?: string;
  date: string;
  type: "task" | "journal" | "note";
  priority?: TaskPriority;
  status?: TaskStatus;
  userId?: string;
  reminder?: boolean;
}

// Extended type for new event form
interface EventForm extends Event {
  time?: string; // Additional field for time input
}

type NewEvent = Partial<EventForm>;

export function InteractiveCalendar() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState<NewEvent>({});
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
  // Form context for better input handling
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "task",
      date: new Date(),
      time: "",
      priority: "medium",
      reminder: false,
      status: "todo"
    }
  });
  
  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => isSameDay(new Date(event.date), selectedDate))
    : [];

  // Fetch events for the current month
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !selectedDate) return;

      try {
        setLoading(true);
        
        // Fetch tasks
        const tasks = await TasksAPI.getTasks(user.id);
        const taskEvents: Event[] = tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.due_date || new Date().toISOString(),
          type: "task",
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority
        }));

        // Fetch journal entries
        const entries = await JournalAPI.getEntries(user.id);
        const journalEvents: Event[] = entries.map(entry => ({
          id: entry.id,
          title: entry.title,
          description: entry.content,
          date: entry.created_at,
          type: "journal"
        }));

        setEvents([...taskEvents, ...journalEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, selectedDate]);

  // Create new event
  const createEvent = async () => {
    if (!user || !selectedDate || !newEvent.title || !newEvent.type) {
      toast.error("Please provide a title and type for the new item");
      return;
    }

    try {
      // Create a date object with the selected date and time if provided
      let eventDate = new Date(selectedDate);
      if (newEvent.time) {
        const [hours, minutes] = newEvent.time.split(':').map(Number);
        eventDate.setHours(hours, minutes);
      }
      
      if (newEvent.type === "task") {
        // Create task with the API
        const task = await TasksAPI.createTask({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description || "",
          due_date: eventDate.toISOString(),
          status: (newEvent.status as TaskStatus) || "todo",
          priority: (newEvent.priority as TaskPriority) || "medium"
        });

        // Add to local state
        const newTaskEvent: Event = {
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.due_date || new Date().toISOString(),
          type: "task",
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority
        };
        
        setEvents(prev => [...prev, newTaskEvent]);
        toast.success("Task created successfully");
      } else if (newEvent.type === "journal") {
        // Create journal with the API
        const entry = await JournalAPI.createEntry({
          user_id: user.id,
          title: newEvent.title,
          content: newEvent.description || "",
          mood: "neutral",
          tags: []
        });

        // Add to local state
        const newJournalEvent: Event = {
          id: entry.id,
          title: entry.title,
          description: entry.content,
          date: entry.created_at,
          type: "journal"
        };
        
        setEvents(prev => [...prev, newJournalEvent]);
        toast.success("Journal entry created successfully");
      } else if (newEvent.type === "note") {
        // Create note in the database
        // For now, we'll use TasksAPI to store notes as tasks with low priority
        const note = await TasksAPI.createTask({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description || "",
          due_date: eventDate.toISOString(),
          status: "todo",
          priority: "low"
        });

        // Add to local state
        const newNoteEvent: Event = {
          id: note.id,
          title: note.title,
          description: note.description,
          date: note.due_date || new Date().toISOString(),
          type: "note", // Mark as note type
          priority: "low"
        };
        
        setEvents(prev => [...prev, newNoteEvent]);
        toast.success("Note created successfully");
      }

      // Reset form and close dialog
      setNewEvent({});
      setAddEventOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(`Failed to create ${newEvent.type}. Please try again.`);
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Badge colors based on event type
  const getEventBadgeVariant = (type: "task" | "journal" | "note") => {
    switch (type) {
      case "task":
        return "destructive";
      case "journal":
        return "accent";
      case "note":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get priority badge style
  const getPriorityBadge = (priority?: TaskPriority) => {
    if (!priority) return null;
    
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return null;
    }
  };

  // Handle time change
  const handleTimeChange = (time: string) => {
    if (!selectedDate) return;
    setNewEvent(prev => ({ ...prev, time }));
  };

  // Handle priority change with type safety
  const handlePriorityChange = (value: string) => {
    if (value === "low" || value === "medium" || value === "high") {
      const priority = value as TaskPriority;
      setNewEvent(prev => ({ ...prev, priority }));
    }
  };

  // Handle status change with type safety
  const handleStatusChange = (value: string) => {
    if (value === "todo" || value === "in_progress" || value === "done") {
      const status = value as TaskStatus;
      setNewEvent(prev => ({ ...prev, status }));
    }
  };

  // Handle reminder change
  const handleReminderChange = (checked: boolean) => {
    setNewEvent(prev => ({ ...prev, reminder: checked }));
  };

  // Function to handle editing an event
  const editEvent = async () => {
    if (!user || !currentEvent || !currentEvent.id) return;
    
    try {
      const eventDate = new Date(currentEvent.date);
      
      if (currentEvent.type === "task") {
        // Update task with the API
        const updatedTask = await TasksAPI.updateTask(currentEvent.id, {
          title: currentEvent.title,
          description: currentEvent.description || "",
          due_date: eventDate.toISOString(),
          status: currentEvent.status as TaskStatus,
          priority: currentEvent.priority as TaskPriority
        });
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event.id === currentEvent.id 
            ? {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                date: updatedTask.due_date || new Date().toISOString(),
                type: "task",
                status: updatedTask.status as TaskStatus,
                priority: updatedTask.priority as TaskPriority
              } 
            : event
        ));
        
        toast.success("Task updated successfully");
      } else if (currentEvent.type === "journal") {
        // Update journal with the API
        const updatedEntry = await JournalAPI.updateEntry(currentEvent.id, {
          title: currentEvent.title,
          content: currentEvent.description || "",
          mood: "neutral" // Keep the original mood or provide a way to edit it
        });
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event.id === currentEvent.id 
            ? {
                id: updatedEntry.id,
                title: updatedEntry.title,
                description: updatedEntry.content,
                date: updatedEntry.created_at,
                type: "journal"
              } 
            : event
        ));
        
        toast.success("Journal entry updated successfully");
      } else if (currentEvent.type === "note") {
        // Update note with the API (notes are stored as tasks with low priority)
        const updatedNote = await TasksAPI.updateTask(currentEvent.id, {
          title: currentEvent.title,
          description: currentEvent.description || "",
          due_date: eventDate.toISOString(),
          status: "todo",
          priority: "low"
        });
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event.id === currentEvent.id 
            ? {
                id: updatedNote.id,
                title: updatedNote.title,
                description: updatedNote.description,
                date: updatedNote.due_date || new Date().toISOString(),
                type: "note",
                priority: "low"
              } 
            : event
        ));
        
        toast.success("Note updated successfully");
      }
      
      // Reset form and close dialog
      setCurrentEvent(null);
      setEditEventOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(`Failed to update ${currentEvent.type}. Please try again.`);
    }
  };

  // Function to handle click on an event
  const handleEventClick = (event: Event) => {
    setCurrentEvent(event);
    setEditEventOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className="w-full" variant="brutal">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>CALENDAR</CardTitle>
        <Button variant="accent" size="sm" className="ml-auto" onClick={() => setAddEventOpen(true)}>
          ADD ITEM
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_320px]">
          {/* Calendar section */}
          <div className="border rounded-md p-4 bg-card/50">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
              <div className="font-medium">Su</div>
              <div className="font-medium">Mo</div>
              <div className="font-medium">Tu</div>
              <div className="font-medium">We</div>
              <div className="font-medium">Th</div>
              <div className="font-medium">Fr</div>
              <div className="font-medium">Sa</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-md p-1",
                    "hover:bg-accent/20 cursor-pointer text-sm",
                    i === 22 && "bg-accent/20"  // Sample active day
                  )}
                  onClick={() => {
                    // Just an example - this would need actual date calculation
                    if (i < 31) setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1));
                  }}
                >
                  {i < 31 ? (i + 1) : ""}
                  <div className="flex gap-0.5 mt-1">
                    {/* Example indicators for days with tasks */}
                    {i === 22 && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-destructive"></div>
                        <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                      </>
                    )}
                    {i === 15 && <div className="w-1 h-1 rounded-full bg-blue-500"></div>}
                    {i === 10 && <div className="w-1 h-1 rounded-full bg-destructive"></div>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive"></div>
                <span className="text-xs">Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs">Journal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs">Notes</span>
              </div>
            </div>
          </div>

          {/* Selected date events */}
          <div className="border rounded-md p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
              </h3>
            </div>
              
            {selectedDateEvents.length > 0 ? (
              <ScrollArea className="h-[320px]">
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="flex flex-col gap-1 pb-3 border-b cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={getEventBadgeVariant(event.type as "task" | "journal" | "note")}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        {event.priority && getPriorityBadge(event.priority)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex h-[320px] items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">No items for this date</p>
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => setAddEventOpen(true)}
                  >
                    Add your first item
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add event dialog */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Create a new task, journal entry, or note for your calendar
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="task" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-3" variant="outline">
              <TabsTrigger value="task">Task</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="note">Note</TabsTrigger>
            </TabsList>

            {/* Task Form */}
            <TabsContent value="task" className="mt-4 space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, type: "task" })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Date picker */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Time picker */}
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time || ""}
                      onChange={(e) => handleTimeChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Task details"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newEvent.priority || "medium"} 
                      onValueChange={handlePriorityChange}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newEvent.status || "todo"} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminder"
                    checked={newEvent.reminder || false}
                    onCheckedChange={handleReminderChange}
                  />
                  <Label htmlFor="reminder">Set a reminder</Label>
                </div>
              </div>
            </TabsContent>

            {/* Journal Form */}
            <TabsContent value="journal" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="j-title">Title</Label>
                  <Input
                    id="j-title"
                    placeholder="Journal entry title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, type: "journal" })}
                  />
                </div>
                
                {/* Date picker */}
                <div className="space-y-2">
                  <Label htmlFor="j-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="j-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="j-content">Journal Entry</Label>
                  <Textarea
                    id="j-content"
                    placeholder="What's on your mind today?"
                    className="min-h-[150px]"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Notes Form */}
            <TabsContent value="note" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="n-title">Title</Label>
                  <Input
                    id="n-title"
                    placeholder="Note title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value, type: "note" })}
                  />
                </div>
                
                {/* Date picker */}
                <div className="space-y-2">
                  <Label htmlFor="n-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="n-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="n-content">Note Content</Label>
                  <Textarea
                    id="n-content"
                    placeholder="Write your note here..."
                    className="min-h-[150px]"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setAddEventOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={createEvent}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit event dialog */}
      <Dialog open={editEventOpen} onOpenChange={setEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit {currentEvent?.type}</DialogTitle>
            <DialogDescription>
              Modify your {currentEvent?.type} details
            </DialogDescription>
          </DialogHeader>
          
          {currentEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                />
              </div>
              
              {/* Date picker */}
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="edit-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentEvent.date ? format(new Date(currentEvent.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={currentEvent.date ? new Date(currentEvent.date) : undefined}
                      onSelect={(date) => setCurrentEvent({ ...currentEvent, date: date ? date.toISOString() : "" })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">{currentEvent.type === "journal" ? "Journal Entry" : "Description"}</Label>
                <Textarea
                  id="edit-description"
                  className={currentEvent.type === "journal" ? "min-h-[150px]" : ""}
                  value={currentEvent.description || ""}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                />
              </div>
              
              {currentEvent.type === "task" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-priority">Priority</Label>
                      <Select 
                        value={currentEvent.priority || "medium"}
                        onValueChange={(value) => setCurrentEvent({ ...currentEvent, priority: value as TaskPriority })}
                      >
                        <SelectTrigger id="edit-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select 
                        value={currentEvent.status || "todo"}
                        onValueChange={(value) => setCurrentEvent({ ...currentEvent, status: value as TaskStatus })}
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editEvent}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 