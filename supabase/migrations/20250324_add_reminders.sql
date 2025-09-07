-- Create reminders table for alarms and reminders functionality
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  snooze_until TIMESTAMP WITH TIME ZONE,
  repeat_pattern TEXT, -- 'none', 'daily', 'weekly', 'monthly', 'yearly'
  repeat_interval INTEGER DEFAULT 1,
  repeat_days INTEGER[], -- days of week for weekly pattern (0=Sunday, 6=Saturday)
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  vibration_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for reminders
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for reminders
CREATE POLICY "Users can view their own reminders" 
  ON reminders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
  ON reminders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON reminders FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
  ON reminders FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_reminders_user_due_date ON reminders(user_id, due_date);
CREATE INDEX idx_reminders_active_due ON reminders(is_active, due_date) WHERE is_active = true;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reminders_updated_at_trigger
    BEFORE UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_reminders_updated_at();

