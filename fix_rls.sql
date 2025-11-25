-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.activities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.session_chats;

-- Create permissive policies for demo purposes (allows anon inserts)
CREATE POLICY "Enable insert for all users" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.activities FOR UPDATE USING (true);

CREATE POLICY "Enable insert for all users" ON public.session_chats FOR INSERT WITH CHECK (true);

-- Ensure read access is still enabled
DROP POLICY IF EXISTS "Enable read access for all users" ON public.activities;
CREATE POLICY "Enable read access for all users" ON public.activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.session_chats;
CREATE POLICY "Enable read access for all users" ON public.session_chats FOR SELECT USING (true);
