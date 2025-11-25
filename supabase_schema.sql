-- Create activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    activity_type TEXT NOT NULL, -- 'session', 'workshop', etc.
    category TEXT NOT NULL,
    image_url TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    -- New columns for live sessions
    is_live BOOLEAN DEFAULT FALSE,
    agora_channel TEXT,
    agora_token TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities (adjust as needed)
CREATE POLICY "Enable read access for all users" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.activities FOR UPDATE USING (auth.role() = 'authenticated');

-- Create session_chats table
CREATE TABLE IF NOT EXISTS public.session_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- Assuming auth.users is used
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for session_chats
ALTER TABLE public.session_chats ENABLE ROW LEVEL SECURITY;

-- Create policies for session_chats
CREATE POLICY "Enable read access for all users" ON public.session_chats FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.session_chats FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_chats;
