-- Add sound_tone column to reminders for selectable alarm tones
ALTER TABLE reminders
  ADD COLUMN IF NOT EXISTS sound_tone TEXT NOT NULL DEFAULT 'beep';

-- Optional: constrain to known values (commented out to allow forwards compatibility)
-- ALTER TABLE reminders
--   ADD CONSTRAINT reminders_sound_tone_check
--   CHECK (sound_tone IN ('beep','classic','chime','digital','pulse'));


