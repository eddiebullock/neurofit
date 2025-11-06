-- Supabase Database Schema for NeuroFit
-- Run this in your Supabase SQL Editor

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  sensory_level TEXT,
  energy_level TEXT,
  environment TEXT,
  workout_time TEXT,
  equipment TEXT,
  special_considerations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  sensory_level TEXT,
  duration INTEGER,
  equipment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout progress table
CREATE TABLE IF NOT EXISTS workout_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for workouts (public read)
CREATE POLICY "Anyone can view workouts"
  ON workouts FOR SELECT
  USING (true);

-- RLS Policies for workout_progress
CREATE POLICY "Users can view their own progress"
  ON workout_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON workout_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Sample workouts (optional - remove if you want to add your own)
INSERT INTO workouts (title, description, tags, sensory_level, duration, equipment) VALUES
('Gentle Morning Stretch', 'A calm 10-minute stretching routine to start your day', ARRAY['stretching', 'low-intensity'], 'low', 10, 'none'),
('Bodyweight Strength', 'Basic strength exercises using only your body weight', ARRAY['strength', 'bodyweight'], 'medium', 20, 'none'),
('Calm Yoga Flow', 'A peaceful yoga sequence designed for low sensory input', ARRAY['yoga', 'flexibility'], 'low', 15, 'none'),
('Walking Meditation', 'Mindful walking exercise combining movement and calm', ARRAY['cardio', 'mindfulness'], 'low', 30, 'none'),
('Desk Break Movement', 'Quick 5-minute movements perfect for work breaks', ARRAY['stretching', 'quick'], 'low', 5, 'none'),
('Evening Wind-Down', 'Gentle movements to help transition to rest', ARRAY['yoga', 'relaxation'], 'low', 15, 'none');

