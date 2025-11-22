-- Update astrology_consultations table to use TEXT for user_id to support Clerk IDs
ALTER TABLE public.astrology_consultations 
  ALTER COLUMN user_id TYPE TEXT;

-- Update astrology_chats table to use TEXT for sender_id to support Clerk IDs
ALTER TABLE public.astrology_chats 
  ALTER COLUMN sender_id TYPE TEXT;
