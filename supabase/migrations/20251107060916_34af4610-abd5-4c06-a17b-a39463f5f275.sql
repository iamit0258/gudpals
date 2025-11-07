-- Drop existing policies on admin_users first
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Now drop the old function that causes recursion
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create a security definer function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE id = _user_id
  )
$$;

-- Create a security definer function to check if user is super admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE id = _user_id AND is_super_admin = true
  )
$$;

-- Recreate policies using the new security definer functions
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users"
ON public.admin_users
FOR ALL
USING (public.is_super_admin(auth.uid()));

-- Update other policies that might have been using the old function
-- Update activities policies
DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;
CREATE POLICY "Admins can manage activities"
ON public.activities
FOR ALL
USING (public.is_admin(auth.uid()));

-- Update digital_literacy_courses policies
DROP POLICY IF EXISTS "Admin can manage courses" ON public.digital_literacy_courses;
CREATE POLICY "Admin can manage courses"
ON public.digital_literacy_courses
FOR ALL
USING (public.is_admin(auth.uid()));

-- Update games policies
DROP POLICY IF EXISTS "Admin can manage games" ON public.games;
CREATE POLICY "Admin can manage games"
ON public.games
FOR ALL
USING (public.is_admin(auth.uid()));

-- Update products policies
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
CREATE POLICY "Admin can manage products"
ON public.products
FOR ALL
USING (public.is_admin(auth.uid()));

-- Update travel_packages policies
DROP POLICY IF EXISTS "Admin can manage travel packages" ON public.travel_packages;
CREATE POLICY "Admin can manage travel packages"
ON public.travel_packages
FOR ALL
USING (public.is_admin(auth.uid()));