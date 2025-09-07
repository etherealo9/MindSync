'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlarmClock, Volume2 } from 'lucide-react';
import { useAlarm } from '@/lib/alarms/alarm-context';
import { useAuth } from '@/lib/supabase/auth-context';
import { type Reminder } from '@/lib/supabase/database';
import { addMinutes } from 'date-fns';

export function TestAlarm() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const { user } = useAuth();

  const createTestReminder = (): Reminder => {
    const now = new Date();
    return {
      id: 'test-alarm-' + Date.now(),
      user_id: user?.id || '',
      title: 'Test Alarm',
      message: 'This is a test of the full screen alarm system. You can dismiss or snooze this alarm.',
      due_date: addMinutes(now, 0).toISOString(), // Due now
      is_active: true,
      snooze_until: null,
      repeat_pattern: 'none',
      repeat_interval: 1,
      repeat_days: null,
      sound_enabled: true,
      sound_tone: 'beep',
      vibration_enabled: true,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
  };

  const handleTestAlarm = () => {
    if (!user) return;
    
    setIsTestRunning(true);
    
    // Create a mock alarm for testing
    const testReminder = createTestReminder();
    
    // Trigger the alarm using a custom event
    window.dispatchEvent(new CustomEvent('test-alarm', {
      detail: { reminder: testReminder }
    }));

    // Reset test state after a delay
    setTimeout(() => {
      setIsTestRunning(false);
    }, 1000);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlarmClock className="h-5 w-5" />
          Test Alarm System
        </CardTitle>
        <CardDescription>
          Test the full screen alarm interface to ensure notifications work properly.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            <span>This will test sound, vibration, and full screen UI</span>
          </div>
          
          <Button 
            onClick={handleTestAlarm}
            disabled={isTestRunning || !user}
            className="w-full"
          >
            {isTestRunning ? 'Testing...' : 'Test Alarm Now'}
          </Button>
          
          {!user && (
            <p className="text-xs text-muted-foreground">
              Please sign in to test alarms
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
