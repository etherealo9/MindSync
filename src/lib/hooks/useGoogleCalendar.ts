"use client";

import { useState, useCallback } from 'react';

type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  location?: string;
  [key: string]: any;
};

type CreateEventParams = {
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  location?: string;
  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
};

type UpdateEventParams = Partial<Omit<CreateEventParams, 'id'>> & {
  eventId: string;
};

export function useGoogleCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Check if Google Calendar is connected
  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/calendar');
      
      if (response.status === 403) {
        setIsConnected(false);
        const data = await response.json();
        
        if (data.auth_url) {
          return { connected: false, authUrl: data.auth_url };
        }
      } else if (response.ok) {
        setIsConnected(true);
        return { connected: true };
      }
      
      return { connected: false };
    } catch (err: any) {
      setError(err.message || 'Failed to check Google Calendar connection');
      return { connected: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get authorization URL
  const getAuthUrl = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/google/authorize');
      
      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }
      
      const { authUrl } = await response.json();
      return authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to get authorization URL');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to Google Calendar
  const connect = useCallback(async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Google Calendar');
    }
  }, [getAuthUrl]);

  // Fetch calendar events
  const fetchEvents = useCallback(async (
    timeMin?: string,
    timeMax?: string,
    maxResults?: number
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (timeMin) params.append('timeMin', timeMin);
      if (timeMax) params.append('timeMax', timeMax);
      if (maxResults) params.append('maxResults', maxResults.toString());
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`/api/calendar${queryString}`);
      
      if (response.status === 403) {
        setIsConnected(false);
        const data = await response.json();
        if (data.auth_url) {
          return { authUrl: data.auth_url };
        }
        throw new Error('Google Calendar not connected');
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch events');
      }
      
      const { events } = await response.json();
      setEvents(events || []);
      setIsConnected(true);
      return events;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calendar events');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new event
  const createEvent = useCallback(async (eventData: CreateEventParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (response.status === 403) {
        setIsConnected(false);
        throw new Error('Google Calendar not connected');
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }
      
      const { event } = await response.json();
      setIsConnected(true);
      return event;
    } catch (err: any) {
      setError(err.message || 'Failed to create calendar event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing event
  const updateEvent = useCallback(async ({ eventId, ...updateData }: UpdateEventParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.status === 403) {
        setIsConnected(false);
        throw new Error('Google Calendar not connected');
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }
      
      const { event } = await response.json();
      setIsConnected(true);
      return event;
    } catch (err: any) {
      setError(err.message || 'Failed to update calendar event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete an event
  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.status === 403) {
        setIsConnected(false);
        throw new Error('Google Calendar not connected');
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete event');
      }
      
      setIsConnected(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete calendar event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get event details
  const getEventDetails = useCallback(async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/calendar/${eventId}`);
      
      if (response.status === 403) {
        setIsConnected(false);
        throw new Error('Google Calendar not connected');
      }
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get event details');
      }
      
      const { event } = await response.json();
      setIsConnected(true);
      return event;
    } catch (err: any) {
      setError(err.message || 'Failed to get event details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
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
    getEventDetails,
  };
} 