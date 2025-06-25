
-- Create products and related tables (currently missing)
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category_id INTEGER,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Astrology feature tables
CREATE TABLE public.astrologers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  specialization TEXT[],
  experience_years INTEGER,
  rate_per_minute NUMERIC(6,2),
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.astrology_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  astrologer_id UUID NOT NULL,
  consultation_type TEXT CHECK (consultation_type IN ('chat', 'call', 'video')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  duration_minutes INTEGER,
  total_cost NUMERIC(8,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.astrology_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User preferences and enhanced profile data
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  astrology_preferences JSONB,
  interests TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Communication and social features
CREATE TABLE public.friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

CREATE TABLE public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL,
  user_id_2 UUID NOT NULL,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id_1, user_id_2)
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content management tables
CREATE TABLE public.digital_literacy_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  instructor TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.employment_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT,
  description TEXT,
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance')),
  salary_range TEXT,
  requirements TEXT[],
  contact_info JSONB,
  is_active BOOLEAN DEFAULT true,
  posted_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE public.travel_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  duration_days INTEGER,
  price NUMERIC(10,2),
  included_services TEXT[],
  images TEXT[],
  max_participants INTEGER,
  available_slots INTEGER,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  game_type TEXT,
  max_players INTEGER,
  min_age INTEGER,
  rules TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notifications system
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrologers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrology_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrology_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_literacy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for product categories (public read)
CREATE POLICY "Anyone can view categories" ON public.product_categories
  FOR SELECT USING (true);

-- RLS Policies for product reviews (users can view all, manage own)
CREATE POLICY "Anyone can view reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON public.product_reviews
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for astrologers
CREATE POLICY "Anyone can view available astrologers" ON public.astrologers
  FOR SELECT USING (is_available = true);

CREATE POLICY "Astrologers can manage own profile" ON public.astrologers
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for astrology consultations
CREATE POLICY "Users can view own consultations" ON public.astrology_consultations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.astrologers WHERE id = astrologer_id)
  );

CREATE POLICY "Users can create consultations" ON public.astrology_consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update consultations" ON public.astrology_consultations
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT user_id FROM public.astrologers WHERE id = astrologer_id)
  );

-- RLS Policies for astrology chats
CREATE POLICY "Consultation participants can view chats" ON public.astrology_chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.astrology_consultations 
      WHERE id = consultation_id 
      AND (user_id = auth.uid() OR astrologer_id IN (
        SELECT id FROM public.astrologers WHERE user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Consultation participants can send messages" ON public.astrology_chats
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for user preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for friend requests
CREATE POLICY "Users can view own friend requests" ON public.friend_requests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send friend requests" ON public.friend_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received requests" ON public.friend_requests
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS Policies for user connections
CREATE POLICY "Users can view own connections" ON public.user_connections
  FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "System can create connections" ON public.user_connections
  FOR INSERT WITH CHECK (true);

-- RLS Policies for chat messages
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for content tables (public read, admin write)
CREATE POLICY "Anyone can view published courses" ON public.digital_literacy_courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage courses" ON public.digital_literacy_courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can view active jobs" ON public.employment_opportunities
  FOR SELECT USING (is_active = true AND expires_at > now());

CREATE POLICY "Users can post jobs" ON public.employment_opportunities
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Job posters can manage own jobs" ON public.employment_opportunities
  FOR ALL USING (auth.uid() = posted_by);

CREATE POLICY "Anyone can view active travel packages" ON public.travel_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage travel packages" ON public.travel_packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can view active games" ON public.games
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage games" ON public.games
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Add foreign key constraints
ALTER TABLE public.products ADD CONSTRAINT fk_products_category 
  FOREIGN KEY (category_id) REFERENCES public.product_categories(id);

ALTER TABLE public.product_reviews ADD CONSTRAINT fk_reviews_product 
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

ALTER TABLE public.astrology_consultations ADD CONSTRAINT fk_consultations_astrologer 
  FOREIGN KEY (astrologer_id) REFERENCES public.astrologers(id);

ALTER TABLE public.astrology_chats ADD CONSTRAINT fk_chats_consultation 
  FOREIGN KEY (consultation_id) REFERENCES public.astrology_consultations(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_consultations_user ON public.astrology_consultations(user_id);
CREATE INDEX idx_consultations_astrologer ON public.astrology_consultations(astrologer_id);
CREATE INDEX idx_consultations_status ON public.astrology_consultations(status);
CREATE INDEX idx_chats_consultation ON public.astrology_chats(consultation_id);
CREATE INDEX idx_friend_requests_receiver ON public.friend_requests(receiver_id);
CREATE INDEX idx_friend_requests_status ON public.friend_requests(status);
CREATE INDEX idx_chat_messages_receiver ON public.chat_messages(receiver_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- Insert some sample data for testing
INSERT INTO public.product_categories (name, description) VALUES
('Health Products', 'Products for health and wellness'),
('Digital Services', 'Online courses and digital content'),
('Astrology Services', 'Astrological consultations and reports'),
('Travel Packages', 'Tour and travel related packages');

INSERT INTO public.products (name, description, price, category_id, stock_quantity) VALUES
('Health Check Package', 'Complete health checkup package', 1999.00, 1, 50),
('Digital Literacy Course', 'Learn smartphone and internet basics', 499.00, 2, 100),
('Astrology Reading', 'Personal astrology consultation', 799.00, 3, 10),
('Goa Beach Package', '3 days 2 nights beach vacation', 8999.00, 4, 20);
