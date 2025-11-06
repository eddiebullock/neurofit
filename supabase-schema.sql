-- NeuroFit MVP Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles table (stores user preferences)
CREATE TABLE IF NOT EXISTS profiles (
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

-- Workouts table (curated workout library)
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

-- Progress table (tracks completed workouts)
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for workouts (public read)
CREATE POLICY "Anyone can view workouts"
  ON workouts FOR SELECT
  USING (true);

-- RLS Policies for progress
CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Seed data: Example workouts
INSERT INTO workouts (title, description, tags, sensory_level, duration, equipment) VALUES
('Gentle Morning Stretch', 'A calm 10-minute stretching routine to start your day peacefully', ARRAY['stretching', 'low-intensity', 'morning'], 'low', 10, 'none'),
('Bodyweight Strength', 'Basic strength exercises using only your body weight - no equipment needed', ARRAY['strength', 'bodyweight', 'moderate'], 'medium', 20, 'none'),
('Calm Yoga Flow', 'A peaceful yoga sequence designed for low sensory input and relaxation', ARRAY['yoga', 'flexibility', 'mindfulness'], 'low', 15, 'none');
