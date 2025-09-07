'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlarmClock, Clock, X, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { type Reminder } from '@/lib/supabase/database';

interface FullScreenAlarmProps {
  reminder: Reminder;
  isOpen: boolean;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

const SNOOZE_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
];

export function FullScreenAlarm({ reminder, isOpen, onDismiss, onSnooze }: FullScreenAlarmProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update current time every second
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle alarm sound and vibration
  useEffect(() => {
    if (!isOpen) {
      // Clean up when alarm is closed
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
      return;
    }

    // Start sound if enabled (Web Audio API patterns)
    if (reminder.sound_enabled && soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        const playTone = (pattern: 'beep' | 'classic' | 'chime' | 'digital' | 'pulse') => {
          const now = audioContext.currentTime;
          const scheduleBeep = (freq: number, duration: number, type: OscillatorType = 'sine', startOffset = 0, volume = 0.3) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(freq, now + startOffset);
            gain.gain.setValueAtTime(volume, now + startOffset);
            gain.gain.exponentialRampToValueAtTime(0.01, now + startOffset + duration);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(now + startOffset);
            oscillator.stop(now + startOffset + duration);
          };

          switch (pattern) {
            case 'beep': {
              scheduleBeep(800, 0.5, 'sine', 0, 0.35);
              break;
            }
            case 'classic': {
              // Two short beeps
              scheduleBeep(700, 0.25, 'square', 0, 0.3);
              scheduleBeep(700, 0.25, 'square', 0.35, 0.3);
              break;
            }
            case 'chime': {
              // Rising triad
              scheduleBeep(523.25, 0.2, 'sine', 0, 0.25); // C5
              scheduleBeep(659.25, 0.2, 'sine', 0.22, 0.25); // E5
              scheduleBeep(783.99, 0.5, 'sine', 0.44, 0.25); // G5
              break;
            }
            case 'digital': {
              // Fast repeating blips
              for (let i = 0; i < 4; i++) {
                scheduleBeep(1000, 0.08, 'sawtooth', i * 0.12, 0.22);
              }
              break;
            }
            case 'pulse': {
              // Low-high pulse
              scheduleBeep(400, 0.15, 'triangle', 0, 0.3);
              scheduleBeep(900, 0.25, 'triangle', 0.18, 0.3);
              break;
            }
          }
        };

        const selected = (reminder as any).sound_tone || 'beep';
        const intervalMs = selected === 'digital' ? 1400 : selected === 'classic' ? 2200 : 2000;
        const soundInterval = setInterval(() => playTone(selected), intervalMs);
        playTone(selected);

        return () => clearInterval(soundInterval);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }

    // Start vibration if enabled and supported
    if (reminder.vibration_enabled && 'vibrate' in navigator) {
      const vibratePattern = [200, 100, 200, 100, 200];
      
      const startVibration = () => {
        navigator.vibrate(vibratePattern);
      };

      startVibration();
      vibrationIntervalRef.current = setInterval(startVibration, 3000);
    }

    return () => {
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
    };
  }, [isOpen, reminder.sound_enabled, reminder.vibration_enabled, soundEnabled]);

  // Animation effect
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
        case ' ':
          event.preventDefault();
          onDismiss();
          break;
        case '1':
          event.preventDefault();
          onSnooze(5);
          break;
        case '2':
          event.preventDefault();
          onSnooze(10);
          break;
        case '3':
          event.preventDefault();
          onSnooze(15);
          break;
        case '4':
          event.preventDefault();
          onSnooze(30);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onDismiss, onSnooze]);

  if (!isOpen) return null;

  const alarmContent = (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-muted/20" />
        <div 
          className={cn(
            "absolute top-0 left-0 w-full h-full transition-transform duration-1000",
            "bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.05)_20px,rgba(0,0,0,0.05)_40px)]",
            "dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_40px)]",
            animationPhase === 0 && "translate-x-0",
            animationPhase === 1 && "translate-x-2",
            animationPhase === 2 && "translate-x-0",
            animationPhase === 3 && "-translate-x-2"
          )} 
        />
      </div>

      {/* Main alarm content */}
      <Card variant="brutal" className="w-full max-w-lg mx-auto bg-card relative">
        <CardHeader className="text-center pb-4">
          {/* Icon and status */}
          <div className="space-y-4">
            <div className="relative mx-auto w-20 h-20">
              <AlarmClock 
                className={cn(
                  "w-20 h-20 text-destructive mx-auto transition-transform duration-300",
                  animationPhase % 2 === 0 ? "scale-110 rotate-12" : "scale-100 rotate-0"
                )} 
              />
            </div>
            
            <Badge 
              variant="destructive" 
              className={cn(
                "text-xl px-6 py-2 font-bold uppercase tracking-wider border-2 border-black dark:border-white rounded-none neo-button",
                animationPhase % 2 === 0 && "animate-pulse"
              )}
            >
              ⏰ ALARM ACTIVE
            </Badge>
          </div>

          {/* Current time */}
          <div className="space-y-2 py-4">
            <div className="text-5xl font-bold font-mono border-4 border-black dark:border-white bg-accent text-accent-foreground p-4 uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-lg font-bold uppercase tracking-wide text-muted-foreground">
              {format(currentTime, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Reminder details */}
          <div className="space-y-3 p-4 border-2 border-black dark:border-white bg-muted shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <CardTitle className="text-2xl text-center">{reminder.title}</CardTitle>
            {reminder.message && (
              <p className="text-muted-foreground text-center font-medium">{reminder.message}</p>
            )}
            <div className="text-sm text-muted-foreground text-center font-bold uppercase tracking-wide border-t-2 border-black dark:border-white pt-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Scheduled for {format(new Date(reminder.due_date), 'h:mm a')}
            </div>
          </div>

          {/* Sound toggle */}
          <div className="flex justify-center">
            <Button
              variant="brutalist"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 uppercase"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </Button>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            {/* Snooze options */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground uppercase tracking-wide text-center border-b-2 border-black dark:border-white pb-2">
                Snooze Options:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SNOOZE_OPTIONS.map((option, index) => (
                  <Button
                    key={option.value}
                    variant="accent"
                    onClick={() => onSnooze(option.value)}
                    className="h-12 text-base font-bold uppercase tracking-wide"
                  >
                    <span className="mr-2 text-lg font-bold">{index + 1}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dismiss button */}
            <Button
              onClick={onDismiss}
              variant="destructive"
              className="w-full h-16 text-xl font-bold uppercase tracking-wider border-2 border-black dark:border-white neo-button"
              size="xl"
            >
              <X className="h-6 w-6 mr-3" />
              Dismiss Alarm
            </Button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-muted-foreground border-2 border-black dark:border-white bg-muted p-3 text-center font-bold uppercase tracking-wide">
            <p>⌨️ Space/Esc = Dismiss • 1-4 = Snooze Options</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render as portal to body for full screen effect
  if (typeof document !== 'undefined') {
    return createPortal(alarmContent, document.body);
  }

  return null;
}

