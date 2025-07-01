
-- Fix infinite recursion in admin_users RLS policies by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create new policies using the security definer function
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (public.get_current_user_admin_status());

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );
