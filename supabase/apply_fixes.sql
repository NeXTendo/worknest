-- =====================================================
-- 1. FIX JWT HELPERS & BREAK RECURSION
-- =====================================================

CREATE OR REPLACE FUNCTION public.jwt_company_id()
RETURNS uuid
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _company_id uuid;
BEGIN
  -- 1. Try JWT claim
  _company_id := (auth.jwt() ->> 'company_id')::uuid;
  IF _company_id IS NOT NULL THEN
    RETURN _company_id;
  END IF;

  -- 2. Fallback to profiles table (bypass RLS via SECURITY DEFINER)
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
  -- 1. Try JWT claim
  _role := auth.jwt() ->> 'role';
  IF _role IS NOT NULL AND _role <> 'authenticated' AND _role <> '' THEN
    RETURN _role;
  END IF;

  -- 2. Fallback to profiles table (bypass RLS via SECURITY DEFINER)
  SELECT role::text INTO _role FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(_role, 'authenticated');
EXCEPTION WHEN OTHERS THEN
  RETURN 'authenticated';
END;
$$;

-- =====================================================
-- 2. FIX RLS POLICIES (BREAK RECURSION)
-- =====================================================

DROP POLICY IF EXISTS profiles_super_admin ON public.profiles;
CREATE POLICY profiles_super_admin ON public.profiles
FOR ALL USING (
  (SELECT role::text FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
);

-- =====================================================
-- 3. FIX RPC FUNCTIONS (NULL-SAFE & EXACT USER LOGIC)
-- =====================================================

CREATE OR REPLACE FUNCTION public.insert_record(p_table_name text, p_data jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    current_role text := public.jwt_role();
    current_user uuid := public.jwt_user_id();
    current_company uuid := public.jwt_company_id();
    new_id uuid := gen_random_uuid();
    sql text;
    col_names text;
    col_values text;
BEGIN
    -- Handle empty data
    IF p_data = '{}'::jsonb OR p_data IS NULL THEN
        EXECUTE format('INSERT INTO public.%I DEFAULT VALUES RETURNING id', p_table_name) INTO new_id;
        RETURN new_id;
    END IF;

    -- Auto-add company_id if exists
    IF NOT p_data ? 'company_id' AND current_company IS NOT NULL THEN
        p_data := jsonb_set(p_data, '{company_id}', to_jsonb(current_company));
    END IF;

    -- Permissions
    IF current_role = 'employee' THEN
        IF p_table_name NOT IN ('attendance','leave_requests','profiles') THEN
            RAISE EXCEPTION 'Employees cannot insert into %', p_table_name;
        END IF;
        IF p_data ? 'employee_id' THEN
            p_data := jsonb_set(p_data, '{employee_id}', to_jsonb(current_user));
        ELSIF p_data ? 'user_id' THEN
            p_data := jsonb_set(p_data, '{user_id}', to_jsonb(current_user));
        END IF;
        IF current_company IS NOT NULL THEN
            p_data := jsonb_set(p_data, '{company_id}', to_jsonb(current_company));
        END IF;
    END IF;

    -- Build dynamic SQL with CRITICAL NULL-SAFE fix
    SELECT string_agg(quote_ident(key), ', '),
           string_agg(COALESCE(format('%L', value), 'NULL'), ', ')
    INTO col_names, col_values
    FROM jsonb_each_text(p_data);

    sql := format('INSERT INTO public.%I (%s) VALUES (%s) RETURNING id', p_table_name, col_names, col_values);
    EXECUTE sql INTO new_id;
    RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_record(p_table_name text, p_record_id uuid, p_updates jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    current_role text := public.jwt_role();
    current_user uuid := public.jwt_user_id();
    current_company uuid := public.jwt_company_id();
    target_company uuid;
    target_user uuid;
    sql_updates text;
BEGIN
    -- Handle empty updates
    IF p_updates = '{}'::jsonb OR p_updates IS NULL THEN
        RETURN p_record_id;
    END IF;

    -- Fetch ownership
    EXECUTE format('SELECT company_id, id AS user_id FROM public.%I WHERE id = $1', p_table_name)
    INTO target_company, target_user
    USING p_record_id;

    -- Role checks
    IF current_role = 'employee' THEN
        IF p_table_name = 'profiles' AND target_user <> current_user THEN
            RAISE EXCEPTION 'Employees can only update their own profile';
        ELSIF p_table_name IN ('attendance','leave_requests') AND target_user <> current_user THEN
            RAISE EXCEPTION 'Employees can only update their own records';
        END IF;
    ELSIF current_role IN ('main_admin','hr_admin') THEN
        IF target_company IS DISTINCT FROM current_company THEN
            RAISE EXCEPTION 'Admins cannot update records outside their company';
        END IF;
    END IF;

    -- Build dynamic SQL
    SELECT string_agg(format('%I = %L', key, value), ', ')
    INTO sql_updates
    FROM jsonb_each_text(p_updates);

    EXECUTE format('UPDATE public.%I SET %s WHERE id = $1 RETURNING id', p_table_name, sql_updates)
    USING p_record_id;

    RETURN p_record_id;
END;
$$;
