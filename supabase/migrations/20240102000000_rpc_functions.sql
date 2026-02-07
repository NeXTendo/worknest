-- Dynamic RPC helpers for WorkNest
-- Re-implemented exactly as provided by the user, with CRITICAL syntax error fixes for NULL handling and empty data.

CREATE OR REPLACE FUNCTION public.delete_record(p_table_name text, p_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    current_role text := public.jwt_role();
    current_user uuid := public.jwt_user_id();
    current_company uuid := public.jwt_company_id();
    record_company_id uuid;
BEGIN
    -- Super admin
    IF current_role = 'super_admin' THEN
        EXECUTE format('DELETE FROM public.%I WHERE id = $1', p_table_name) USING p_id;
        RETURN;
    END IF;

    -- Admin
    IF current_role IN ('main_admin','hr_admin') THEN
        EXECUTE format('SELECT company_id FROM public.%I WHERE id = $1', p_table_name) INTO record_company_id USING p_id;
        IF record_company_id IS NULL OR record_company_id != current_company THEN
            RAISE EXCEPTION 'Cannot delete records outside your company';
        END IF;
        EXECUTE format('DELETE FROM public.%I WHERE id = $1', p_table_name) USING p_id;
        RETURN;
    END IF;

    -- Employee
    IF current_role = 'employee' THEN
        IF p_table_name NOT IN ('profiles','attendance','leave_requests') THEN
            RAISE EXCEPTION 'Employees cannot delete records from %', p_table_name;
        END IF;
        EXECUTE format('SELECT id FROM public.%I WHERE id = $1 AND (user_id = $2 OR employee_id = $2)', p_table_name)
        INTO record_company_id
        USING p_id, current_user;

        IF record_company_id IS NULL THEN
            RAISE EXCEPTION 'Employees can only delete their own records';
        END IF;

        EXECUTE format('DELETE FROM public.%I WHERE id = $1', p_table_name) USING p_id;
        RETURN;
    END IF;

    RAISE EXCEPTION 'Unknown role (%), cannot delete', current_role;
END;
$function$;

CREATE OR REPLACE FUNCTION public.insert_record(p_table_name text, p_data jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    current_role text := public.jwt_role();
    current_user uuid := public.jwt_user_id();
    current_company uuid := public.jwt_company_id();
    new_id uuid := gen_random_uuid();
    sql text;
    col_names text;
    col_values text;
BEGIN
    -- Handle empty data to prevent syntax error at or near ")"
    IF p_data = '{}'::jsonb OR p_data IS NULL THEN
        EXECUTE format('INSERT INTO public.%I DEFAULT VALUES RETURNING id', p_table_name) INTO new_id;
        RETURN new_id;
    END IF;

    -- Auto-add company_id if exists in table but missing from data
    -- Note: We only add if current_company is not null
    IF NOT p_data ? 'company_id' AND current_company IS NOT NULL THEN
        p_data := jsonb_set(p_data, '{company_id}', to_jsonb(current_company));
    END IF;

    -- Permissions
    IF current_role = 'employee' THEN
        IF p_table_name NOT IN ('attendance','leave_requests','profiles') THEN
            RAISE EXCEPTION 'Employees cannot insert into %', p_table_name;
        END IF;
        -- Ensure ownership
        IF p_data ? 'employee_id' THEN
            p_data := jsonb_set(p_data, '{employee_id}', to_jsonb(current_user));
        ELSIF p_data ? 'user_id' THEN
            p_data := jsonb_set(p_data, '{user_id}', to_jsonb(current_user));
        END IF;
        IF current_company IS NOT NULL THEN
            p_data := jsonb_set(p_data, '{company_id}', to_jsonb(current_company));
        END IF;
    END IF;

    -- Build dynamic SQL
    -- CRITICAL FIX: Use COALESCE(format('%L', value), 'NULL') to ensure NULL values 
    -- are not skipped by string_agg, which causes column/value count mismatch.
    SELECT string_agg(quote_ident(key), ', '),
           string_agg(COALESCE(format('%L', value), 'NULL'), ', ')
    INTO col_names, col_values
    FROM jsonb_each_text(p_data);

    sql := format('INSERT INTO public.%I (%s) VALUES (%s) RETURNING id', p_table_name, col_names, col_values);

    EXECUTE sql INTO new_id;

    RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_record(p_table_name text, p_record_id uuid, p_updates jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    current_role text := public.jwt_role();
    current_user uuid := public.jwt_user_id();
    current_company uuid := public.jwt_company_id();
    target_company uuid;
    target_user uuid;
    sql_updates text;
BEGIN
    -- Guard against empty updates to prevent "SET  WHERE" syntax error
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
$function$;
