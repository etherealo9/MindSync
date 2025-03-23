import { supabase } from './client';

// Types for database tables
export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'task' | 'journal' | 'system' | 'reminder';
  is_read: boolean;
  related_entity_id?: string;
  related_entity_type?: string;
  created_at: string;
};

export type GoogleCalendarAuth = {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expiry_date: number;
  created_at: string;
  updated_at: string;
};

// Tasks API
export const TasksAPI = {
  // Get all tasks for a user
  getTasks: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get a single task by ID
  getTask: async (taskId: string): Promise<Task | null> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create a new task
  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an existing task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
  }
};

// Journal Entries API
export const JournalAPI = {
  // Get all journal entries for a user
  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get a single journal entry by ID
  getEntry: async (entryId: string): Promise<JournalEntry | null> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create a new journal entry
  createEntry: async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an existing journal entry
  updateEntry: async (entryId: string, updates: Partial<JournalEntry>): Promise<JournalEntry> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a journal entry
  deleteEntry: async (entryId: string): Promise<void> => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) throw error;
  }
};

// User Settings API
export const SettingsAPI = {
  // Get user settings
  getSettings: async (userId: string): Promise<UserSettings | null> => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "No rows returned" error
    
    return data;
  },

  // Create or update user settings
  saveSettings: async (settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>): Promise<UserSettings> => {
    // Check if settings exist
    const existing = await SettingsAPI.getSettings(settings.user_id);
    
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', settings.user_id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('user_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};

// Notifications API
export const NotificationsAPI = {
  // Get all notifications for a user
  getNotifications: async (userId: string, limit = 20): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get unread notifications count
  getUnreadCount: async (userId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return count || 0;
  },

  // Mark a notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
  },

  // Create a new notification
  createNotification: async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Google Calendar API
export const GoogleCalendarAPI = {
  // Save or update Google OAuth tokens
  saveTokens: async (
    userId: string, 
    tokens: { 
      access_token: string; 
      refresh_token: string; 
      token_type: string; 
      expiry_date: number;
    }
  ): Promise<GoogleCalendarAuth> => {
    // Check if tokens already exist for this user
    const { data: existingTokens, error: fetchError } = await supabase
      .from('google_calendar_auth')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    if (existingTokens) {
      // Update existing tokens
      const { data, error } = await supabase
        .from('google_calendar_auth')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || existingTokens.refresh_token, // Keep existing refresh token if not provided
          token_type: tokens.token_type,
          expiry_date: tokens.expiry_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTokens.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new tokens entry
      const { data, error } = await supabase
        .from('google_calendar_auth')
        .insert({
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
          expiry_date: tokens.expiry_date
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Get tokens for a user
  getTokens: async (userId: string): Promise<GoogleCalendarAuth | null> => {
    const { data, error } = await supabase
      .from('google_calendar_auth')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Remove tokens for a user (disconnect Google Calendar)
  removeTokens: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('google_calendar_auth')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Check if a user has connected Google Calendar
  isConnected: async (userId: string): Promise<boolean> => {
    const tokens = await GoogleCalendarAPI.getTokens(userId);
    return !!tokens;
  }
}; 