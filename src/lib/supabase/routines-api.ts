import { supabase } from './client';
import { Routine } from './database';

// Routines API
export const RoutinesAPI = {
  // Get all routines for a user
  getRoutines: async (userId: string): Promise<Routine[]> => {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get a single routine by ID
  getRoutine: async (routineId: string): Promise<Routine | null> => {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('id', routineId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create a new routine
  createRoutine: async (routine: Omit<Routine, 'id' | 'created_at' | 'updated_at'>): Promise<Routine> => {
    const { data, error } = await supabase
      .from('routines')
      .insert(routine)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update an existing routine
  updateRoutine: async (routineId: string, updates: Partial<Routine>): Promise<Routine> => {
    const { data, error } = await supabase
      .from('routines')
      .update(updates)
      .eq('id', routineId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a routine
  deleteRoutine: async (routineId: string): Promise<void> => {
    const { error } = await supabase
      .from('routines')
      .delete()
      .eq('id', routineId);
    
    if (error) throw error;
  }
}; 