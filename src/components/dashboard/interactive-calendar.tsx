"use client";

import { useState } from "react";
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

type EventType = "task" | "journal" | "note";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: EventType;
  description?: string;
  time?: string;
  priority?: string;
  reminder?: boolean;
  status?: string;
}

// Mock data for demo purposes
const mockEvents: CalendarEvent[] = [
  { id: 1, title: "Project planning", date: new Date(), type: "task", priority: "high", time: "13:00", status: "pending" },
  { id: 2, title: "Team meeting", date: new Date(Date.now() + 86400000), type: "task", time: "15:00", priority: "medium", status: "pending" },
  { id: 3, title: "Learned about async/await", date: new Date(Date.now() - 86400000), type: "journal" },
  { id: 4, title: "Ideas for new app", date: new Date(), type: "note" },
];

export function InteractiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    type: "task",
    date: new Date(),
    time: "",
    priority: "medium",
    reminder: false,
    status: "pending"
  });
  
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
      status: "pending"
    }
  });
  
  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  // Handle adding new event
  const handleAddEvent = () => {
    if (selectedDate && newEvent.title) {
      const event: CalendarEvent = {
        id: Date.now(),
        title: newEvent.title || "",
        description: newEvent.description || "",
        date: selectedDate,
        type: newEvent.type as EventType || "task",
        time: newEvent.time,
        priority: newEvent.priority,
        reminder: newEvent.reminder,
        status: newEvent.status
      };
      
      setEvents([...events, event]);
      setNewEvent({ 
        title: "", 
        description: "", 
        type: "task",
        date: selectedDate,
        time: "",
        priority: "medium",
        reminder: false,
        status: "pending"
      });
      setAddEventOpen(false);
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
  const getEventBadgeVariant = (type: EventType) => {
    switch (type) {
      case "task":
        return "destructive";
      case "journal":
        return "accent";
      case "note":
        return "outline";
      default:
        return "default";
    }
  };

  // Get priority badge style
  const getPriorityBadge = (priority?: string) => {
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
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
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
                    <div key={event.id} className="flex flex-col gap-1 pb-3 border-b">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={getEventBadgeVariant(event.type)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        {event.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.priority && getPriorityBadge(event.priority)}
                        {event.status && <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{event.status}</span>}
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
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
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
                      value={newEvent.priority} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, priority: value })}
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
                      value={newEvent.status} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminder"
                    checked={newEvent.reminder || false}
                    onCheckedChange={(checked) => setNewEvent({ ...newEvent, reminder: checked })}
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

            {/* Note Form */}
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
                    placeholder="Your note..."
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
            <Button variant="accent" onClick={handleAddEvent}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 