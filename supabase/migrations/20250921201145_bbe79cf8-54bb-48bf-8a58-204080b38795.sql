-- Fix infinite recursion in admin_users RLS policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT CASE 
    WHEN EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN 'admin'
    ELSE 'user'
  END;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Fix RLS policies for admin_users to prevent infinite recursion
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users" ON public.admin_users
FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

-- Fix profiles table RLS policies for proper security
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON public.profiles;

CREATE POLICY "Users can view their own profiles" ON public.profiles
FOR SELECT USING (id = auth.uid()::text);

CREATE POLICY "Users can insert their own profiles" ON public.profiles
FOR INSERT WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Users can update their own profiles" ON public.profiles
FOR UPDATE USING (id = auth.uid()::text);

CREATE POLICY "Users can delete their own profiles" ON public.profiles
FOR DELETE USING (id = auth.uid()::text);

-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;