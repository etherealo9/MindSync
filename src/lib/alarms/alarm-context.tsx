'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { RemindersAPI, type Reminder } from '@/lib/supabase/database';
import { useAuth } from '@/lib/supabase/auth-context';
import { useNotifications } from '@/lib/notifications/notification-context';
import { FullScreenAlarm } from '@/components/alarms/FullScreenAlarm';
import { addMinutes, isBefore } from 'date-fns';

interface AlarmContextType {
  activeAlarm: Reminder | null;
  dismissAlarm: () => void;
  snoozeAlarm: (minutes: number) => void;
  checkForDueReminders: () => Promise<void>;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export function useAlarm() {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
}

interface AlarmProviderProps {
  children: ReactNode;
}

export function AlarmProvider({ children }: AlarmProviderProps) {
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);
  const [checkedReminders, setCheckedReminders] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  // Check for due reminders
  const checkForDueReminders = useCallback(async () => {
    if (!user) return;

    try {
      const reminders = await RemindersAPI.getActiveReminders(user.id);
      const now = new Date();

      for (const reminder of reminders) {
        const dueDate = new Date(reminder.due_date);
        const snoozeUntil = reminder.snooze_until ? new Date(reminder.snooze_until) : null;
        
        // Skip if snoozed
        if (snoozeUntil && isBefore(now, snoozeUntil)) {
          continue;
        }

        // Check if reminder is due (within 1 minute of due time)
        const isOverdue = isBefore(dueDate, now);
        const isDueSoon = isBefore(dueDate, addMinutes(now, 1));
        
        if ((isOverdue || isDueSoon) && !checkedReminders.has(reminder.id)) {
          // Mark as checked to avoid duplicate triggers
          setCheckedReminders(prev => new Set(prev).add(reminder.id));
          
          // Trigger full screen alarm
          setActiveAlarm(reminder);
          
          // Create a notification as backup
          await createNotification({
            user_id: user.id,
            title: `⏰ ${reminder.title}`,
            message: reminder.message || 'Reminder alarm',
            type: 'reminder',
            is_read: false,
            related_entity_id: reminder.id,
            related_entity_type: 'reminder'
          });

          // Request notification permission if not already granted
          if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
          }

                     // Show browser notification as backup
           if ('Notification' in window && Notification.permission === 'granted') {
             const notificationOptions: NotificationOptions = {
               body: reminder.message || 'Reminder alarm',
               icon: '/icons/icon-192x192.png',
               badge: '/icons/icon-72x72.png',
               requireInteraction: true,
               tag: `reminder-${reminder.id}`,
             };
             
             // Add vibration if supported
             if (reminder.vibration_enabled && 'vibrate' in navigator) {
               navigator.vibrate([200, 100, 200]);
             }
             
             new Notification(reminder.title, notificationOptions);
           }

          break; // Only show one alarm at a time
        }
      }
    } catch (error) {
      type SupabaseErrorShape = {
        message?: string;
        code?: string;
        details?: string;
        hint?: string;
        status?: number;
      };

      const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
      const e = (isObject(error) ? (error as SupabaseErrorShape) : { message: String(error) });

      console.error('Error checking for due reminders:', {
        message: e.message,
        code: (e as SupabaseErrorShape).code,
        details: (e as SupabaseErrorShape).details,
        hint: (e as SupabaseErrorShape).hint,
        status: (e as SupabaseErrorShape).status,
      });
    }
  }, [user, createNotification, checkedReminders]);

  // Dismiss current alarm
  const dismissAlarm = async () => {
    if (!activeAlarm) return;

    try {
      // Skip DB operations for synthetic test alarms
      if (activeAlarm.id.startsWith('test-alarm-')) {
        setActiveAlarm(null);
        return;
      }
      // Mark reminder as inactive if it doesn't repeat
      if (activeAlarm.repeat_pattern === 'none') {
        await RemindersAPI.dismissReminder(activeAlarm.id);
      } else {
                 // For repeating reminders, schedule next occurrence
         const nextDueDate = calculateNextOccurrence(activeAlarm);
         if (nextDueDate) {
           await RemindersAPI.updateReminder(activeAlarm.id, {
             due_date: nextDueDate.toISOString(),
             snooze_until: undefined,
           });
        } else {
          await RemindersAPI.dismissReminder(activeAlarm.id);
        }
      }

      setActiveAlarm(null);
    } catch (error) {
      const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
      const e = isObject(error) ? (error as { message?: string; code?: string; details?: string; hint?: string }) : { message: String(error) };
      console.error('Error dismissing alarm:', {
        message: e.message,
        code: e.code,
        details: e.details,
        hint: e.hint,
      });
      // Still close the alarm UI even if API call fails
      setActiveAlarm(null);
    }
  };

  // Snooze current alarm
  const snoozeAlarm = async (minutes: number) => {
    if (!activeAlarm) return;

    try {
      // Skip DB operations for synthetic test alarms
      if (activeAlarm.id.startsWith('test-alarm-')) {
        setActiveAlarm(null);
        return;
      }
      const snoozeUntil = addMinutes(new Date(), minutes);
      await RemindersAPI.snoozeReminder(activeAlarm.id, snoozeUntil);
      
      // Remove from checked set so it can trigger again after snooze
      setCheckedReminders(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeAlarm.id);
        return newSet;
      });
      
      setActiveAlarm(null);
    } catch (error) {
      console.error('Error snoozing alarm:', error);
      // Still close the alarm UI even if API call fails
      setActiveAlarm(null);
    }
  };

  // Calculate next occurrence for repeating reminders
  const calculateNextOccurrence = (reminder: Reminder): Date | null => {
    const currentDue = new Date(reminder.due_date);
    
    switch (reminder.repeat_pattern) {
      case 'daily':
        return new Date(currentDue.getTime() + (24 * 60 * 60 * 1000));
      
      case 'weekly':
        return new Date(currentDue.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      case 'monthly':
        const nextMonth = new Date(currentDue);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      
      case 'yearly':
        const nextYear = new Date(currentDue);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear;
      
      default:
        return null;
    }
  };

  // Set up periodic checking for due reminders
  useEffect(() => {
    if (!user) return;

    // Check immediately
    checkForDueReminders();

    // Then check every 30 seconds
    const interval = setInterval(checkForDueReminders, 30000);

    return () => clearInterval(interval);
  }, [user, checkForDueReminders]);

  // Handle test alarm events
  useEffect(() => {
    const handleTestAlarm = (event: CustomEvent) => {
      const { reminder } = event.detail;
      if (reminder) {
        setActiveAlarm(reminder);
      }
    };

    window.addEventListener('test-alarm', handleTestAlarm as EventListener);
    
    return () => {
      window.removeEventListener('test-alarm', handleTestAlarm as EventListener);
    };
  }, []);

  // Listen for service worker messages
  useEffect(() => {
    const handleServiceWorkerMessage = async (event: MessageEvent) => {
      const { type, reminderId, minutes } = event.data;

      switch (type) {
        case 'snooze-reminder':
          if (reminderId && minutes) {
            try {
              if (String(reminderId).startsWith('test-alarm-')) {
                if (activeAlarm?.id === reminderId) setActiveAlarm(null);
                return;
              }
              const snoozeUntil = addMinutes(new Date(), minutes);
              await RemindersAPI.snoozeReminder(reminderId, snoozeUntil);
              
              // If this is the active alarm, close it
              if (activeAlarm?.id === reminderId) {
                setActiveAlarm(null);
              }
              
              // Remove from checked set
              setCheckedReminders(prev => {
                const newSet = new Set(prev);
                newSet.delete(reminderId);
                return newSet;
              });
            } catch (error) {
              console.error('Error snoozing reminder from notification:', error);
            }
          }
          break;

        case 'dismiss-reminder':
          if (reminderId) {
            try {
              if (String(reminderId).startsWith('test-alarm-')) {
                if (activeAlarm?.id === reminderId) setActiveAlarm(null);
                return;
              }
              const reminder = await RemindersAPI.getReminder(reminderId);
              if (reminder) {
                if (reminder.repeat_pattern === 'none') {
                  await RemindersAPI.dismissReminder(reminderId);
                } else {
                  const nextDueDate = calculateNextOccurrence(reminder);
                                     if (nextDueDate) {
                     await RemindersAPI.updateReminder(reminderId, {
                       due_date: nextDueDate.toISOString(),
                       snooze_until: undefined,
                     });
                  } else {
                    await RemindersAPI.dismissReminder(reminderId);
                  }
                }
                
                // If this is the active alarm, close it
                if (activeAlarm?.id === reminderId) {
                  setActiveAlarm(null);
                }
              }
            } catch (error) {
              console.error('Error dismissing reminder from notification:', error);
            }
          }
          break;

        case 'sync-reminders':
                 // Re-check for due reminders after sync
           await checkForDueReminders();
           break;
       }
     };

     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
       
       return () => {
         navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
       };
     }
   }, [activeAlarm, checkForDueReminders]);

  // Clear checked reminders periodically to allow re-triggering
  useEffect(() => {
    const interval = setInterval(() => {
      setCheckedReminders(new Set());
    }, 5 * 60 * 1000); // Clear every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Wake lock to prevent screen from turning off during alarms
  useEffect(() => {
    let wakeLock: unknown = null;

         const requestWakeLock = async () => {
       if ('wakeLock' in navigator && activeAlarm) {
         try {
           wakeLock = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen');
         } catch (error) {
           console.warn('Wake lock not supported or failed:', error);
         }
       }
     };

    const releaseWakeLock = () => {
      if (wakeLock && typeof wakeLock === 'object' && 'release' in wakeLock) {
        (wakeLock as { release: () => void }).release();
        wakeLock = null;
      }
    };

    if (activeAlarm) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => releaseWakeLock();
  }, [activeAlarm]);

  const value = {
    activeAlarm,
    dismissAlarm,
    snoozeAlarm,
    checkForDueReminders,
  };

  return (
    <AlarmContext.Provider value={value}>
      {children}
      
      {/* Full Screen Alarm Modal */}
      {activeAlarm && (
        <FullScreenAlarm
          reminder={activeAlarm}
          isOpen={!!activeAlarm}
          onDismiss={dismissAlarm}
          onSnooze={snoozeAlarm}
        />
      )}
    </AlarmContext.Provider>
  );
}

