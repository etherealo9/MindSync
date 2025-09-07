'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlarmClock, Clock, Plus } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import { RemindersAPI, type Reminder } from '@/lib/supabase/database';
import { format, formatDistanceToNow, isBefore, addHours } from 'date-fns';
import Link from 'next/link';

export function ReminderStatus() {
  const { user } = useAuth();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUpcomingReminders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const reminders = await RemindersAPI.getActiveReminders(user.id);
      
      // Filter for reminders in the next 24 hours
      const now = new Date();
      const tomorrow = addHours(now, 24);
      
      const upcoming = reminders.filter(reminder => {
        const dueDate = new Date(reminder.due_date);
        const snoozeUntil = reminder.snooze_until ? new Date(reminder.snooze_until) : null;
        
        // Skip snoozed reminders
        if (snoozeUntil && isBefore(now, snoozeUntil)) {
          return false;
        }
        
        return dueDate >= now && dueDate <= tomorrow;
      }).slice(0, 3); // Show only next 3
      
      setUpcomingReminders(upcoming);
    } catch (error) {
      console.error('Error loading upcoming reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpcomingReminders();
    
    // Refresh every minute
    const interval = setInterval(loadUpcomingReminders, 60000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlarmClock className="h-4 w-4" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlarmClock className="h-4 w-4" />
            Upcoming Reminders
          </CardTitle>
          <Link href="/dashboard/reminders">
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>
          {upcomingReminders.length === 0 
            ? 'No reminders in the next 24 hours'
            : `${upcomingReminders.length} reminder${upcomingReminders.length === 1 ? '' : 's'} coming up`
          }
        </CardDescription>
      </CardHeader>
      
      {upcomingReminders.length > 0 && (
        <CardContent className="space-y-3">
          {upcomingReminders.map((reminder) => {
            const dueDate = new Date(reminder.due_date);
            const isOverdue = isBefore(dueDate, new Date());
            
            return (
              <div 
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{reminder.title}</p>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(dueDate, 'MMM d, h:mm a')}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(dueDate, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  {reminder.sound_enabled && (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5z" />
                    </svg>
                  )}
                  {reminder.vibration_enabled && (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5S7.5 11.515 7.5 14s2.015 4.5 4.5 4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.464 8.464L4.929 4.929m9.9 9.9l3.536 3.536M8.464 15.536L4.929 19.071m9.9-9.9l3.536-3.536" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
          
          <Link href="/dashboard/reminders">
            <Button variant="outline" size="sm" className="w-full mt-2">
              View All Reminders
            </Button>
          </Link>
        </CardContent>
      )}
    </Card>
  );
}
