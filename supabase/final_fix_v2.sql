-- =====================================================
-- FINAL FIX V2: RESOLVE CREATION FAILURES FOR SUPER_ADMIN
-- =====================================================

-- 1. Correct insert_record logic to skip company_id injection for 'companies' table
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

    -- Auto-add company_id ONLY IF:
    -- - It's not already in the data
    -- - It's not the 'companies' table (which doesn't have company_id)
    -- - We have a valid current_company to inject
    IF NOT p_data ? 'company_id' AND p_table_name <> 'companies' AND current_company IS NOT NULL THEN
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
    END IF;

    -- Build dynamic SQL with NULL-safe formatting
    SELECT string_agg(quote_ident(key), ', '),
           string_agg(COALESCE(format('%L', value), 'NULL'), ', ')
    INTO col_names, col_values
    FROM jsonb_each_text(p_data);

    sql := format('INSERT INTO public.%I (%s) VALUES (%s) RETURNING id', p_table_name, col_names, col_values);
    EXECUTE sql INTO new_id;
    RETURN new_id;
END;
$$;

-- 2. Update RLS Policies to allow Super Admins to bypass company_id checks on INSERT/UPDATE
-- We apply this to all tenant-partitioned tables.

-- Profiles
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles
FOR UPDATE USING (jwt_role() = 'super_admin' OR id = auth.uid());

-- Departments
DROP POLICY IF EXISTS dept_write ON public.departments;
CREATE POLICY dept_write ON public.departments
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());

-- Job Titles
DROP POLICY IF EXISTS jt_write ON public.job_titles;
CREATE POLICY jt_write ON public.job_titles
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());

-- Announcements
DROP POLICY IF EXISTS ann_write ON public.announcements;
CREATE POLICY ann_write ON public.announcements
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());

-- Employees
DROP POLICY IF EXISTS emp_write ON public.employees;
CREATE POLICY emp_write ON public.employees
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());

-- Attendance
DROP POLICY IF EXISTS att_write ON public.attendance;
CREATE POLICY att_write ON public.attendance
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());

-- Leave Requests
DROP POLICY IF EXISTS leave_write ON public.leave_requests;
CREATE POLICY leave_write ON public.leave_requests
FOR ALL USING (
  jwt_role() = 'super_admin'
  OR (company_id = jwt_company_id() AND jwt_role() IN ('main_admin','hr_admin'))
)
WITH CHECK (jwt_role() = 'super_admin' OR company_id = jwt_company_id());
