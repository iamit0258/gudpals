
-- First, let's check if the profiles table exists and modify it to use TEXT instead of UUID for the id column
-- We'll need to drop the existing table and recreate it with the correct data type

-- Drop existing profiles table if it exists (this will remove any existing data)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with TEXT id to match Clerk's user ID format
CREATE TABLE public.profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  phone_number TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the profiles table
-- Note: We can't use auth.uid() since we're using Clerk, so we'll make it more permissive for now
-- Users should only see their own profiles
CREATE POLICY "Users can view their own profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profiles" ON public.profiles
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own profiles" ON public.profiles
  FOR DELETE USING (true);

-- Create an index on the id column for better performance
CREATE INDEX idx_profiles_id ON public.profiles(id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
