"use client";

import { useEffect, useState } from 'react';
import { useGoogleCalendar } from '@/lib/hooks/useGoogleCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, PlusIcon, RefreshCw, Trash2, Edit, ExternalLink } from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Form schema for creating/editing events
const eventFormSchema = z.object({
  summary: z.string().min(1, { message: 'Event title is required' }),
  description: z.string().optional(),
  location: z.string().optional(),
  startDateTime: z.string().min(1, { message: 'Start date is required' }),
  endDateTime: z.string().min(1, { message: 'End date is required' }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Event item component
const EventItem = ({ 
  event, 
  onEdit, 
  onDelete 
}: { 
  event: any; 
  onEdit: (event: any) => void; 
  onDelete: (eventId: string) => void;
}) => {
  const startDate = parseISO(event.start.dateTime);
  const endDate = parseISO(event.end.dateTime);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md font-semibold">{event.summary}</CardTitle>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(event)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(event.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {format(startDate, 'MMM d, yyyy h:mm a')} - {format(endDate, 'h:mm a')}
        </CardDescription>
      </CardHeader>
      {event.description && (
        <CardContent className="py-0 text-sm">
          <p className="line-clamp-2">{event.description}</p>
        </CardContent>
      )}
      {event.location && (
        <CardFooter className="pt-2 pb-2 text-xs text-muted-foreground">
          📍 {event.location}
        </CardFooter>
      )}
    </Card>
  );
};

// Event form component
const EventForm = ({ 
  event, 
  onSubmit, 
  onCancel 
}: { 
  event?: any; 
  onSubmit: (values: EventFormValues) => void; 
  onCancel: () => void;
}) => {
  // Initialize form with default values or existing event
  const defaultValues: Partial<EventFormValues> = event ? {
    summary: event.summary,
    description: event.description || '',
    location: event.location || '',
    startDateTime: event.start?.dateTime ? new Date(event.start.dateTime).toISOString().slice(0, 16) : '',
    endDateTime: event.end?.dateTime ? new Date(event.end.dateTime).toISOString().slice(0, 16) : '',
  } : {
    summary: '',
    description: '',
    location: '',
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: addDays(new Date(), 1).toISOString().slice(0, 16),
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{event ? 'Update Event' : 'Create Event'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Main Calendar component
export function CalendarView() {
  const {
    isLoading,
    error,
    isConnected,
    events,
    checkConnection,
    connect,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useGoogleCalendar();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [timeRange, setTimeRange] = useState({
    timeMin: new Date().toISOString(),
    timeMax: addDays(new Date(), 30).toISOString(),
  });

  // Check connection status on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await checkConnection();
        if (result.connected) {
          loadEvents();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };

    initialize();
  }, [checkConnection]);

  // Load events based on time range
  const loadEvents = async () => {
    try {
      await fetchEvents(timeRange.timeMin, timeRange.timeMax, 50);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  // Handle creating a new event
  const handleCreateEvent = async (values: EventFormValues) => {
    try {
      await createEvent({
        summary: values.summary,
        description: values.description,
        location: values.location,
        start: {
          dateTime: new Date(values.startDateTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(values.endDateTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      
      setIsCreateDialogOpen(false);
      loadEvents();
      toast.success('Event created successfully');
    } catch (err: any) {
      toast.error('Failed to create event: ' + err.message);
    }
  };

  // Handle editing an event
  const handleEditEvent = async (values: EventFormValues) => {
    if (!selectedEvent) return;
    
    try {
      await updateEvent({
        eventId: selectedEvent.id,
        summary: values.summary,
        description: values.description,
        location: values.location,
        start: {
          dateTime: new Date(values.startDateTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(values.endDateTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      loadEvents();
      toast.success('Event updated successfully');
    } catch (err: any) {
      toast.error('Failed to update event: ' + err.message);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(eventId);
      loadEvents();
      toast.success('Event deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete event: ' + err.message);
    }
  };

  // Open edit dialog for an event
  const openEditDialog = (event: any) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  // If not connected, show connect button
  if (isConnected === false) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>
            Connect your Google Calendar to manage events from this app.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Button onClick={connect} className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Connect Google Calendar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Calendar Events</CardTitle>
            <CardDescription>
              Manage your upcoming events and meetings
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadEvents} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No upcoming events. Click "New Event" to create one.
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            {events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onEdit={openEditDialog}
                onDelete={handleDeleteEvent}
              />
            ))}
          </ScrollArea>
        )}
      </CardContent>
      
      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Add a new event to your Google Calendar.
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            onSubmit={handleCreateEvent} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the details of your event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventForm 
              event={selectedEvent}
              onSubmit={handleEditEvent} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedEvent(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
} 