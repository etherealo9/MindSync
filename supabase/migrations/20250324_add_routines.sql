-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  schedule JSONB NOT NULL DEFAULT '{"days": [], "time": null}'::jsonb,
  tasks JSONB[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

-- Create policies for routines
CREATE POLICY "Users can view their own routines" 
  ON routines FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own routines" 
  ON routines FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines" 
  ON routines FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines" 
  ON routines FOR DELETE 
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX routines_user_id_idx ON routines(user_id);
CREATE INDEX routines_created_at_idx ON routines(created_at); 