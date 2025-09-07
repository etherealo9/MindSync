'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Clock, Bell, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/supabase/auth-context';
import { RemindersAPI, type Reminder } from '@/lib/supabase/database';
import { format, isBefore, addMinutes } from 'date-fns';
import { toast } from 'sonner';
import { TestAlarm } from '@/components/alarms/TestAlarm';

export default function RemindersPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [repeatPattern, setRepeatPattern] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('none');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundTone, setSoundTone] = useState<'beep' | 'classic' | 'chime' | 'digital' | 'pulse'>('beep');

  // Load reminders
  const loadReminders = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await RemindersAPI.getReminders(userId);
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  // Reset form
  const resetForm = () => {
    setTitle('');
    setMessage('');
    setDueDate('');
    setDueTime('');
    setRepeatPattern('none');
    setSoundEnabled(true);
    setVibrationEnabled(true);
    setSoundTone('beep');
    setEditingReminder(null);
  };

  // Open edit dialog
  const openEditDialog = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setMessage(reminder.message || '');
    
    const date = new Date(reminder.due_date);
    setDueDate(format(date, 'yyyy-MM-dd'));
    setDueTime(format(date, 'HH:mm'));
    setRepeatPattern(reminder.repeat_pattern);
    setSoundEnabled(reminder.sound_enabled);
    setVibrationEnabled(reminder.vibration_enabled);
    setSoundTone((reminder.sound_tone ?? 'beep') as Reminder['sound_tone']);
    setDialogOpen(true);
  };

  // Save reminder
  const saveReminder = async () => {
    if (!user || !title.trim() || !dueDate || !dueTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const due_date = new Date(`${dueDate}T${dueTime}`);
      
      const reminderData: Omit<Reminder, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        title: title.trim(),
        message: (message.trim() || undefined),
        due_date: due_date.toISOString(),
        repeat_pattern: repeatPattern,
        repeat_interval: 1,
        sound_enabled: soundEnabled,
        sound_tone: soundTone,
        vibration_enabled: vibrationEnabled,
        is_active: true,
      };

      if (editingReminder) {
        await RemindersAPI.updateReminder(editingReminder.id, reminderData);
        toast.success('Reminder updated successfully');
      } else {
        await RemindersAPI.createReminder(reminderData);
        toast.success('Reminder created successfully');
      }

      setDialogOpen(false);
      resetForm();
      loadReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('Failed to save reminder');
    }
  };

  // Delete reminder
  const deleteReminder = async (id: string) => {
    try {
      await RemindersAPI.deleteReminder(id);
      toast.success('Reminder deleted');
      loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  // Toggle reminder active state
  const toggleReminder = async (id: string, isActive: boolean) => {
    try {
      await RemindersAPI.toggleReminder(id, !isActive);
      toast.success(`Reminder ${!isActive ? 'enabled' : 'disabled'}`);
      loadReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  // Get status info for reminder
  type StatusInfo = {
    status: 'disabled' | 'overdue' | 'soon' | 'active';
    color: 'default' | 'secondary' | 'destructive';
    text: string;
  };

  const getReminderStatus = (reminder: Reminder): StatusInfo => {
    const now = new Date();
    const dueDate = new Date(reminder.due_date);
    
    if (!reminder.is_active) {
      return { status: 'disabled', color: 'secondary', text: 'Disabled' };
    }
    
    if (isBefore(dueDate, now)) {
      return { status: 'overdue', color: 'destructive', text: 'Overdue' };
    }
    
    if (isBefore(dueDate, addMinutes(now, 60))) {
      return { status: 'soon', color: 'default', text: 'Due Soon' };
    }
    
    return { status: 'active', color: 'default', text: 'Active' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Set alarms and reminders to stay on track
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
              </DialogTitle>
              <DialogDescription>
                Set up an alarm or reminder to help you stay organized.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Take medication"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due-date">Date *</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div>
                  <Label htmlFor="due-time">Time *</Label>
                  <Input
                    id="due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="repeat">Repeat</Label>
                <Select value={repeatPattern} onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly') => setRepeatPattern(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound">Sound</Label>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                {soundEnabled && (
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={soundTone} onValueChange={(v: 'beep' | 'classic' | 'chime' | 'digital' | 'pulse') => setSoundTone(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beep">Beep</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="chime">Chime</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                        <SelectItem value="pulse">Pulse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration">Vibration</Label>
                  <Switch
                    id="vibration"
                    checked={vibrationEnabled}
                    onCheckedChange={setVibrationEnabled}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={saveReminder} className="flex-1">
                  {editingReminder ? 'Update' : 'Create'} Reminder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Alarm Component */}
      <TestAlarm />

      {/* Reminders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first reminder to get started with alarms and notifications.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Reminder
              </Button>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => {
            const status = getReminderStatus(reminder);
            
            return (
              <Card key={reminder.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{reminder.title}</CardTitle>
                        <Badge variant={status.color}>{status.text}</Badge>
                      </div>
                      {reminder.message && (
                        <CardDescription>{reminder.message}</CardDescription>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReminder(reminder.id, reminder.is_active)}
                      >
                        {reminder.is_active ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(reminder.due_date), 'MMM d, yyyy h:mm a')}
                    </div>
                    
                    {reminder.repeat_pattern !== 'none' && (
                      <div className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {reminder.repeat_pattern}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {reminder.sound_enabled && (
                        <Bell className="h-4 w-4" />
                      )}
                      {reminder.vibration_enabled && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5S7.5 11.515 7.5 14s2.015 4.5 4.5 4.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.464 8.464L4.929 4.929m9.9 9.9l3.536 3.536M8.464 15.536L4.929 19.071m9.9-9.9l3.536-3.536" />
                        </svg>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

