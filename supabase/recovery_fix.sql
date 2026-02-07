-- =====================================================
-- RECOVERY FIX: RESTORE PROFILE ACCESS & BREAK RECURSION
-- =====================================================

-- 1. Ensure JWT Helpers are SECURITY DEFINER (Bypass RLS)
CREATE OR REPLACE FUNCTION public.jwt_company_id()
RETURNS uuid
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _company_id uuid;
BEGIN
  -- Try JWT claim first
  _company_id := (auth.jwt() ->> 'company_id')::uuid;
  IF _company_id IS NOT NULL THEN
    RETURN _company_id;
  END IF;

  -- Fallback to profiles table (SECURITY DEFINER allows bypassing recursion)
  SELECT company_id INTO _company_id FROM public.profiles WHERE id = auth.uid();
  RETURN _company_id;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS text
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role text;
BEGIN
  -- Try JWT claim first
  _role := auth.jwt() ->> 'role';
  IF _role IS NOT NULL AND _role <> 'authenticated' AND _role <> '' THEN
    RETURN _role;
  END IF;

  -- Fallback to profiles table (SECURITY DEFINER allows bypassing recursion)
  SELECT role::text INTO _role FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(_role, 'authenticated');
EXCEPTION WHEN OTHERS THEN
  RETURN 'authenticated';
END;
$$;

-- 2. Clean up and Fix Profile RLS Policies
-- CRITICAL: Remove the recursive subquery policy
DROP POLICY IF EXISTS profiles_super_admin ON public.profiles;
DROP POLICY IF EXISTS profiles_view ON public.profiles;
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_admin ON public.profiles;

-- Allow Super Admins complete access (Broken recursion via safe jwt_role() wrapper)
CREATE POLICY profiles_super_admin ON public.profiles
FOR ALL USING (jwt_role() = 'super_admin');

-- Allow users to view their own profile and admins to view their company profiles
CREATE POLICY profiles_view ON public.profiles
FOR SELECT USING (
  id = auth.uid() 
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin','manager'))
);

-- Allow users to update their own profile
CREATE POLICY profiles_update_self ON public.profiles
FOR UPDATE USING (id = auth.uid());

-- Allow admins to insert new profiles
CREATE POLICY profiles_insert_admin ON public.profiles
FOR INSERT WITH CHECK (
  jwt_role() IN ('super_admin','main_admin','hr_admin')
);

-- 3. Final Verification check for Companies (Optional but recommended)
DROP POLICY IF EXISTS companies_super_admin ON public.companies;
DROP POLICY IF EXISTS companies_view_own ON public.companies;

CREATE POLICY companies_super_admin ON public.companies
FOR ALL USING (jwt_role() = 'super_admin');

CREATE POLICY companies_view_own ON public.companies
FOR SELECT USING (id = jwt_company_id());
