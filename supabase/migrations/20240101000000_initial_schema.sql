-- WorkNest Database Schema
-- Multi-tenant Employee Management System
-- Copyright © 2024 TechOhns. All rights reserved.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Get current company ID from JWT
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'company_id', '')::uuid;
$$;

-- Get current user role from JWT
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
$$;

-- Get current user ID
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'intern', 'temporary');
CREATE TYPE employment_status AS ENUM ('active', 'on_leave', 'suspended', 'terminated', 'pending');
CREATE TYPE user_role AS ENUM ('super_admin', 'main_admin', 'hr_admin', 'manager', 'employee');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE leave_type AS ENUM ('annual', 'sick', 'maternity', 'paternity', 'unpaid', 'compassionate');
CREATE TYPE payroll_status AS ENUM ('draft', 'processing', 'processed', 'paid', 'failed');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'on_leave');

-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================

CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    logo_url text,
    primary_color text DEFAULT '#14B8A6',
    secondary_color text DEFAULT '#0F172A',
    accent_color text DEFAULT '#10B981',
    website text,
    industry text,
    employee_count integer DEFAULT 0,
    address text,
    city text,
    country text DEFAULT 'Zambia',
    phone text,
    email text,
    registration_number text,
    tax_id text,
    is_active boolean DEFAULT true,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ============================================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'employee',
    employee_id text,
    username text UNIQUE,
    first_name text,
    last_name text,
    email text UNIQUE NOT NULL,
    phone text,
    avatar_url text,
    date_of_birth date,
    gender text,
    must_change_password boolean DEFAULT true,
    is_active boolean DEFAULT true,
    last_login timestamptz,
    preferences jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_username CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$'),
    CONSTRAINT employee_id_unique_per_company UNIQUE (company_id, employee_id)
);

-- Create index for faster lookups
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_employee_id ON public.profiles(employee_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- DEPARTMENTS TABLE
-- ============================================================================

CREATE TABLE public.departments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    budget numeric(15, 2),
    employee_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT department_name_unique_per_company UNIQUE (company_id, name)
);

CREATE INDEX idx_departments_company_id ON public.departments(company_id);
CREATE INDEX idx_departments_manager_id ON public.departments(manager_id);

-- ============================================================================
-- JOB TITLES TABLE
-- ============================================================================

CREATE TABLE public.job_titles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    level text,
    base_salary numeric(15, 2),
    requirements text[],
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT job_title_unique_per_company UNIQUE (company_id, title)
);

CREATE INDEX idx_job_titles_company_id ON public.job_titles(company_id);
CREATE INDEX idx_job_titles_department_id ON public.job_titles(department_id);

-- ============================================================================
-- EMPLOYEES TABLE
-- ============================================================================

CREATE TABLE public.employees (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_number text NOT NULL,
    department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
    job_title_id uuid REFERENCES public.job_titles(id) ON DELETE SET NULL,
    manager_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
    
    -- Personal Information
    first_name text NOT NULL,
    middle_name text,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    alternate_phone text,
    date_of_birth date,
    gender text,
    nationality text DEFAULT 'Zambian',
    national_id text,
    passport_number text,
    avatar_url text,
    
    -- Address Information
    address_line_1 text,
    address_line_2 text,
    city text,
    state_province text,
    postal_code text,
    country text DEFAULT 'Zambia',
    
    -- Emergency Contact
    emergency_contact_name text,
    emergency_contact_relationship text,
    emergency_contact_phone text,
    emergency_contact_address text,
    
    -- Employment Details
    employment_type employment_type NOT NULL DEFAULT 'full_time',
    employment_status employment_status NOT NULL DEFAULT 'active',
    hire_date date NOT NULL,
    contract_start_date date,
    contract_end_date date,
    probation_end_date date,
    termination_date date,
    termination_reason text,
    
    -- Bank Information
    bank_name text,
    bank_account_number text,
    bank_account_name text,
    bank_branch text,
    bank_swift_code text,
    
    -- Health & Insurance
    health_insurance_provider text,
    health_insurance_number text,
    health_insurance_expiry date,
    pension_number text,
    social_security_number text,
    
    -- Compensation
    base_salary numeric(15, 2),
    currency text DEFAULT 'ZMW',
    pay_frequency text DEFAULT 'monthly',
    tax_number text,
    
    -- Additional
    notes text,
    skills text[],
    certifications jsonb DEFAULT '[]',
    documents jsonb DEFAULT '[]',
    
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT employee_number_unique_per_company UNIQUE (company_id, employee_number),
    CONSTRAINT valid_employment_dates CHECK (hire_date <= COALESCE(termination_date, hire_date)),
    CONSTRAINT valid_contract_dates CHECK (contract_start_date <= COALESCE(contract_end_date, contract_start_date))
);

CREATE INDEX idx_employees_company_id ON public.employees(company_id);
CREATE INDEX idx_employees_user_id ON public.employees(user_id);
CREATE INDEX idx_employees_department_id ON public.employees(department_id);
CREATE INDEX idx_employees_status ON public.employees(company_id, employment_status);
CREATE INDEX idx_employees_hire_date ON public.employees(hire_date);

-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================

CREATE TABLE public.attendance (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date date NOT NULL,
    time_in timestamptz,
    time_out timestamptz,
    status attendance_status NOT NULL DEFAULT 'present',
    hours_worked numeric(5, 2),
    overtime_hours numeric(5, 2) DEFAULT 0,
    late_by_minutes integer DEFAULT 0,
    location text,
    ip_address inet,
    notes text,
    verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT attendance_unique_per_day UNIQUE (company_id, employee_id, date),
    CONSTRAINT valid_times CHECK (time_in <= COALESCE(time_out, time_in))
);

CREATE INDEX idx_attendance_company_id ON public.attendance(company_id);
CREATE INDEX idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX idx_attendance_date ON public.attendance(company_id, date);
CREATE INDEX idx_attendance_status ON public.attendance(company_id, status);

-- ============================================================================
-- LEAVE REQUESTS TABLE
-- ============================================================================

CREATE TABLE public.leave_requests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type leave_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    days_requested numeric(5, 2) NOT NULL,
    reason text,
    status leave_status NOT NULL DEFAULT 'pending',
    reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    review_notes text,
    documents jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT valid_leave_dates CHECK (start_date <= end_date),
    CONSTRAINT positive_days CHECK (days_requested > 0)
);

CREATE INDEX idx_leave_requests_company_id ON public.leave_requests(company_id);
CREATE INDEX idx_leave_requests_employee_id ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(company_id, status);
CREATE INDEX idx_leave_requests_dates ON public.leave_requests(start_date, end_date);

-- ============================================================================
-- PAYROLL TABLE
-- ============================================================================

CREATE TABLE public.payroll (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    pay_period_start date NOT NULL,
    pay_period_end date NOT NULL,
    
    -- Earnings
    base_salary numeric(15, 2) NOT NULL,
    overtime_pay numeric(15, 2) DEFAULT 0,
    bonuses numeric(15, 2) DEFAULT 0,
    allowances numeric(15, 2) DEFAULT 0,
    commission numeric(15, 2) DEFAULT 0,
    gross_pay numeric(15, 2) NOT NULL,
    
    -- Deductions
    tax numeric(15, 2) DEFAULT 0,
    pension_contribution numeric(15, 2) DEFAULT 0,
    health_insurance numeric(15, 2) DEFAULT 0,
    other_deductions numeric(15, 2) DEFAULT 0,
    total_deductions numeric(15, 2) DEFAULT 0,
    
    -- Net
    net_pay numeric(15, 2) NOT NULL,
    
    currency text DEFAULT 'ZMW',
    payment_method text DEFAULT 'bank_transfer',
    payment_date date,
    payment_reference text,
    status payroll_status NOT NULL DEFAULT 'draft',
    
    processed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    processed_at timestamptz,
    notes text,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    CONSTRAINT payroll_unique_per_period UNIQUE (company_id, employee_id, pay_period_start),
    CONSTRAINT valid_pay_period CHECK (pay_period_start <= pay_period_end),
    CONSTRAINT valid_gross_pay CHECK (gross_pay >= 0),
    CONSTRAINT valid_net_pay CHECK (net_pay >= 0)
);

CREATE INDEX idx_payroll_company_id ON public.payroll(company_id);
CREATE INDEX idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX idx_payroll_period ON public.payroll(company_id, pay_period_start, pay_period_end);
CREATE INDEX idx_payroll_status ON public.payroll(company_id, status);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE public.announcements (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    category text,
    priority text DEFAULT 'normal',
    is_pinned boolean DEFAULT false,
    published_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_departments uuid[],
    target_roles user_role[],
    attachments jsonb DEFAULT '[]',
    published_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_announcements_company_id ON public.announcements(company_id);
CREATE INDEX idx_announcements_published_at ON public.announcements(published_at);
CREATE INDEX idx_announcements_pinned ON public.announcements(company_id, is_pinned);

-- ============================================================================
-- QR CODES TABLE (for attendance)
-- ============================================================================

CREATE TABLE public.qr_codes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    code text NOT NULL UNIQUE,
    type text NOT NULL DEFAULT 'attendance',
    valid_from timestamptz NOT NULL,
    valid_until timestamptz NOT NULL,
    is_active boolean DEFAULT true,
    usage_count integer DEFAULT 0,
    max_usage integer,
    metadata jsonb DEFAULT '{}',
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_qr_period CHECK (valid_from < valid_until)
);

CREATE INDEX idx_qr_codes_company_id ON public.qr_codes(company_id);
CREATE INDEX idx_qr_codes_code ON public.qr_codes(code);
CREATE INDEX idx_qr_codes_validity ON public.qr_codes(valid_from, valid_until);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_logs_company_id ON public.audit_logs(company_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMPANIES POLICIES
-- ============================================================================

CREATE POLICY "Companies: Super admin full access"
ON public.companies FOR ALL
USING (current_role() = 'super_admin');

CREATE POLICY "Companies: Users can view own company"
ON public.companies FOR SELECT
USING (id = current_company_id());

CREATE POLICY "Companies: Main admin can update own company"
ON public.companies FOR UPDATE
USING (
    id = current_company_id() 
    AND current_role() IN ('main_admin', 'hr_admin')
);

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Profiles: Super admin full access"
ON public.profiles FOR ALL
USING (current_role() = 'super_admin');

CREATE POLICY "Profiles: Users can view own profile"
ON public.profiles FOR SELECT
USING (
    id = current_user_id()
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin', 'manager')
    )
);

CREATE POLICY "Profiles: Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = current_user_id())
WITH CHECK (
    id = current_user_id()
    AND company_id = current_company_id() -- prevent company switching
);

CREATE POLICY "Profiles: Admins can insert"
ON public.profiles FOR INSERT
WITH CHECK (
    current_role() IN ('super_admin', 'main_admin', 'hr_admin')
    AND company_id = current_company_id()
);

-- ============================================================================
-- DEPARTMENTS POLICIES
-- ============================================================================

CREATE POLICY "Departments: View access"
ON public.departments FOR SELECT
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin', 'manager', 'employee')
    )
);

CREATE POLICY "Departments: Modify access"
ON public.departments FOR ALL
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

-- ============================================================================
-- EMPLOYEES POLICIES
-- ============================================================================

CREATE POLICY "Employees: View access"
ON public.employees FOR SELECT
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND (
            current_role() IN ('main_admin', 'hr_admin', 'manager')
            OR user_id = current_user_id()
        )
    )
);

CREATE POLICY "Employees: Admins can insert"
ON public.employees FOR INSERT
WITH CHECK (
    current_role() IN ('super_admin', 'main_admin', 'hr_admin')
    AND company_id = current_company_id()
);

CREATE POLICY "Employees: Admins can update"
ON public.employees FOR UPDATE
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
)
WITH CHECK (
    company_id = current_company_id() -- prevent company switching
);

CREATE POLICY "Employees: Admins can delete"
ON public.employees FOR DELETE
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() = 'main_admin'
    )
);

-- ============================================================================
-- ATTENDANCE POLICIES
-- ============================================================================

CREATE POLICY "Attendance: View access"
ON public.attendance FOR SELECT
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND (
            current_role() IN ('main_admin', 'hr_admin', 'manager')
            OR employee_id IN (
                SELECT id FROM public.employees 
                WHERE user_id = current_user_id()
            )
        )
    )
);

CREATE POLICY "Attendance: Employees can insert own"
ON public.attendance FOR INSERT
WITH CHECK (
    company_id = current_company_id()
    AND (
        current_role() IN ('super_admin', 'main_admin', 'hr_admin')
        OR employee_id IN (
            SELECT id FROM public.employees 
            WHERE user_id = current_user_id()
        )
    )
);

CREATE POLICY "Attendance: Admins can modify"
ON public.attendance FOR UPDATE
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

-- ============================================================================
-- LEAVE REQUESTS POLICIES
-- ============================================================================

CREATE POLICY "Leave: View access"
ON public.leave_requests FOR SELECT
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND (
            current_role() IN ('main_admin', 'hr_admin', 'manager')
            OR employee_id IN (
                SELECT id FROM public.employees 
                WHERE user_id = current_user_id()
            )
        )
    )
);

CREATE POLICY "Leave: Employees can insert own requests"
ON public.leave_requests FOR INSERT
WITH CHECK (
    company_id = current_company_id()
    AND employee_id IN (
        SELECT id FROM public.employees 
        WHERE user_id = current_user_id()
    )
);

CREATE POLICY "Leave: Admins can update"
ON public.leave_requests FOR UPDATE
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

-- ============================================================================
-- PAYROLL POLICIES
-- ============================================================================

CREATE POLICY "Payroll: Admins only view"
ON public.payroll FOR SELECT
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

CREATE POLICY "Payroll: Admins only modify"
ON public.payroll FOR ALL
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================

CREATE POLICY "Announcements: All can view"
ON public.announcements FOR SELECT
USING (
    current_role() = 'super_admin'
    OR company_id = current_company_id()
);

CREATE POLICY "Announcements: Admins can insert"
ON public.announcements FOR INSERT
WITH CHECK (
    current_role() IN ('super_admin', 'main_admin', 'hr_admin')
    AND company_id = current_company_id()
);

CREATE POLICY "Announcements: Admins can update"
ON public.announcements FOR UPDATE
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

-- ============================================================================
-- QR CODES POLICIES
-- ============================================================================

CREATE POLICY "QR Codes: Admins can manage"
ON public.qr_codes FOR ALL
USING (
    current_role() = 'super_admin'
    OR (
        company_id = current_company_id()
        AND current_role() IN ('main_admin', 'hr_admin')
    )
);

CREATE POLICY "QR Codes: All can view active"
ON public.qr_codes FOR SELECT
USING (
    company_id = current_company_id()
    AND is_active = true
);

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

CREATE POLICY "Audit: Super admin full access"
ON public.audit_logs FOR ALL
USING (current_role() = 'super_admin');

CREATE POLICY "Audit: Admins can view own company"
ON public.audit_logs FOR SELECT
USING (
    company_id = current_company_id()
    AND current_role() IN ('main_admin', 'hr_admin')
);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.job_titles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to automatically set company_id from JWT on insert
CREATE OR REPLACE FUNCTION public.set_company_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.company_id IS NULL THEN
        NEW.company_id := current_company_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply company_id trigger to relevant tables
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.departments FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.job_titles FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.employees FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.attendance FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.payroll FOR EACH ROW EXECUTE FUNCTION set_company_id();
CREATE TRIGGER set_company_id_trigger BEFORE INSERT ON public.announcements FOR EACH ROW EXECUTE FUNCTION set_company_id();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_employees_company_dept_status ON public.employees(company_id, department_id, employment_status);
CREATE INDEX idx_attendance_emp_date_status ON public.attendance(employee_id, date, status);
CREATE INDEX idx_leave_emp_dates ON public.leave_requests(employee_id, start_date, end_date);
CREATE INDEX idx_payroll_emp_period ON public.payroll(employee_id, pay_period_start, pay_period_end);

-- ============================================================================
-- SEED DATA (Optional - for development)
-- ============================================================================

-- Insert TechOhns as the platform company (super admin company)
INSERT INTO public.companies (id, name, logo_url, website, industry, country, city)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'TechOhns',
    NULL,
    'https://techohns.com',
    'Technology',
    'Zambia',
    'Lusaka'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant appropriate permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant read-only access to anon for public endpoints (if needed)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.companies TO anon;

-- End of schema
