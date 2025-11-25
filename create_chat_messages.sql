-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id TEXT NOT NULL, -- Using TEXT to match Clerk IDs if needed, or UUID if using Supabase Auth
    receiver_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo (adjust for production)
CREATE POLICY "Enable read access for all users" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.chat_messages FOR UPDATE USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
