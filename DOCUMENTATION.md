# WorkNest - Complete Project Documentation
## "Home to every workforce"

**Copyright © 2024 TechOhns. All rights reserved.**

Developed by:
- Pumulo Mubiana - +260975271902 - [LinkedIn](https://www.linkedin.com/in/pumulo-mubiana)
- Samuel Wakumelo - +260971632781 - [LinkedIn](https://www.linkedin.com/in/samuel-wakumelo)

Location: Lusaka, Zambia
Established: 2024

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features & Capabilities](#features--capabilities)
4. [Installation Guide](#installation-guide)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [Component Library](#component-library)
9. [API Routes & Server Actions](#api-routes--server-actions)
10. [Deployment](#deployment)
11. [Development Workflow](#development-workflow)
12. [Best Practices](#best-practices)

---

## 🎯 PROJECT OVERVIEW

WorkNest is an enterprise-grade, multi-tenant Employee Management System (EMS) built for modern businesses. It provides comprehensive HR management, payroll processing, attendance tracking, leave management, and advanced analytics.

### Key Characteristics:
- **Multi-tenant architecture** - Multiple companies, complete data isolation
- **Role-based access control** - 5 permission levels with granular controls
- **Real-time updates** - Live search, filtering, pagination
- **Mobile responsive** - Works on all devices
- **Production-ready** - Security headers, RLS policies, audit logs
- **White-label ready** - Company branding (logo, colors, name)

---

## 🛠️ TECHNOLOGY STACK

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Email**: Resend
- **QR Codes**: qrcode library

### DevOps
- **Hosting**: Vercel
- **Version Control**: Git
- **CI/CD**: Vercel auto-deploy
- **Monitoring**: Vercel Analytics (optional)

---

## ✨ FEATURES & CAPABILITIES

### 1. Dashboard
- Executive summary with KPIs
- Interactive charts (line, bar, pie, area)
- Quick actions panel
- Attendance heatmap
- Payroll overview
- Leave calendar
- Recent activities feed
- Department performance metrics

### 2. Employee Management
- **Complete CRUD operations**
- Advanced filtering (department, status, type, date range)
- Live search with debouncing
- Pagination (10, 25, 50, 100 per page)
- Bulk actions (export, deactivate, send emails)
- Employee drawer (view without page reload)
- Photo upload with automatic URL conversion
- Comprehensive employee profiles:
  - Personal information
  - Employment details
  - Bank information
  - Health & insurance
  - Emergency contacts
  - Documents & certifications
  - Skills & qualifications

### 3. Attendance System
- **QR Code-based check-in/out**
- Daily QR generation by admins
- Auto-calculated work hours
- Overtime tracking
- Late arrivals monitoring
- Multiple views: Table, Calendar, Chart
- Attendance reports (daily, weekly, monthly)
- Department-wise attendance
- Export to Excel/PDF

### 4. Leave Management
- Employee leave requests
- HR approval workflow
- Leave type classification:
  - Annual leave
  - Sick leave
  - Maternity/Paternity
  - Unpaid leave
  - Compassionate leave
- Leave balance tracking
- Calendar view
- Conflict detection
- Email notifications

### 5. Payroll Processing
- Automated payroll calculation
- Bonus & deduction management
- Tax calculations
- Pension contributions
- Payslip generation
- Bulk processing
- Department payroll summary
- Export & print capabilities
- Payment history
- Salary structure management

### 6. Departments
- Department CRUD
- Budget tracking
- Employee count per department
- Department head assignment
- Revenue tracking (if applicable)
- Operations management (ongoing, upcoming, completed)
- Job title hierarchy
- Department analytics

### 7. Announcements
- Company-wide or targeted announcements
- Rich text editor
- File attachments
- Priority levels (low, normal, high, urgent)
- Pinned announcements
- Department/role targeting
- Expiry dates
- Read receipts

### 8. User Management
- View all system users
- Role assignment
- Account activation/deactivation
- Password reset
- Login activity tracking
- Permission management

### 9. Settings & Configuration
- Company branding (logo, colors, name)
- System preferences
- Email templates
- QR code settings
- Default values
- Theme switching (light/dark)
- Software information
- About TechOhns

### 10. Security Features
- Row Level Security (RLS)
- JWT-based authentication
- Password complexity requirements
- Forced password change on first login
- Session management
- Audit logging
- IP tracking
- HTTPS enforcement
- CSRF protection
- XSS prevention

---

## 📦 INSTALLATION GUIDE

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.6.7 or higher
- Git
- Supabase account
- Resend account (for emails)
- Vercel account (for deployment)

### Step 1: Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd worknest

# Install dependencies
npm install
```

### Step 2: Supabase Setup
1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Go to Project Settings > Database
5. Copy your database password

### Step 3: Environment Variables
```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@worknest.app
```

### Step 4: Database Migration
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

Alternatively, run the SQL migration manually:
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/migrations/20240101000000_initial_schema.sql`
3. Run the SQL

### Step 5: Supabase Storage Setup
1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `worknest-avatars`
3. Set it to Public
4. Add policy:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'worknest-avatars');

-- Allow public read access
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'worknest-avatars');
```

### Step 6: Resend Setup
1. Sign up at https://resend.com
2. Verify your domain or use their test domain
3. Create an API key
4. Add to `.env.local`

### Step 7: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### Step 8: Create First Super Admin
Run this SQL in Supabase to create your super admin account:

```sql
-- Create auth user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@worknest.app',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"super_admin"}'::jsonb
);

-- Get the user ID
SELECT id FROM auth.users WHERE email = 'admin@worknest.app';

-- Create profile (replace USER_ID with the ID from above)
INSERT INTO public.profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  must_change_password,
  company_id
) VALUES (
  'USER_ID',
  'admin@worknest.app',
  'super_admin',
  'Super',
  'Admin',
  false,
  '00000000-0000-0000-0000-000000000000'
);
```

---

## 📁 PROJECT STRUCTURE

```
worknest/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (platform)/               # Super admin platform
│   │   ├── companies/
│   │   │   └── page.tsx
│   │   ├── platform-users/
│   │   │   └── page.tsx
│   │   ├── audit-logs/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Main dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── @drawer/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── departments/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── attendance/
│   │   │   └── page.tsx
│   │   ├── payroll/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── leave/
│   │   │   └── page.tsx
│   │   ├── announcements/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── callback/
│   │   │       └── route.ts
│   │   ├── employees/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── attendance/
│   │   │   └── scan/
│   │   │       └── route.ts
│   │   ├── payroll/
│   │   │   └── process/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                    # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── switch.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── calendar.tsx
│   │   ├── command.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── tooltip.tsx
│   ├── layout/                   # Layout components
│   │   ├── app-sidebar.tsx
│   │   ├── app-header.tsx
│   │   ├── app-footer.tsx
│   │   └── dashboard-layout.tsx
│   ├── employees/                # Employee components
│   │   ├── employee-table.tsx
│   │   ├── employee-drawer.tsx
│   │   ├── employee-form.tsx
│   │   └── employee-card.tsx
│   ├── attendance/               # Attendance components
│   │   ├── attendance-table.tsx
│   │   ├── qr-scanner.tsx
│   │   ├── qr-generator.tsx
│   │   └── attendance-chart.tsx
│   ├── payroll/                  # Payroll components
│   │   ├── payroll-table.tsx
│   │   ├── payroll-form.tsx
│   │   ├── payslip.tsx
│   │   └── payroll-summary.tsx
│   ├── leave/                    # Leave components
│   │   ├── leave-table.tsx
│   │   ├── leave-form.tsx
│   │   ├── leave-calendar.tsx
│   │   └── leave-approval.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── stat-card.tsx
│   │   ├── metric-card.tsx
│   │   ├── chart-card.tsx
│   │   ├── recent-activities.tsx
│   │   └── quick-actions.tsx
│   ├── shared/                   # Shared components
│   │   ├── data-table.tsx
│   │   ├── search-bar.tsx
│   │   ├── filter-bar.tsx
│   │   ├── pagination.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── loading-state.tsx
│   │   ├── file-upload.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── status-badge.tsx
│   │   ├── role-badge.tsx
│   │   ├── avatar-upload.tsx
│   │   └── print-view.tsx
│   ├── auth/                     # Auth components
│   │   ├── login-form.tsx
│   │   ├── reset-password-form.tsx
│   │   └── protected-route.tsx
│   ├── providers/                # Context providers
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── company-branding-provider.tsx
│   └── guards/                   # Route guards
│       ├── role-gate.tsx
│       └── permission-gate.tsx
├── lib/                          # Libraries & utilities
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── email/
│   │   ├── resend.ts
│   │   └── templates/
│   │       ├── welcome.tsx
│   │       ├── password-reset.tsx
│   │       ├── leave-approved.tsx
│   │       └── payslip.tsx
│   ├── qr/
│   │   ├── generator.ts
│   │   └── validator.ts
│   ├── pdf/
│   │   ├── generator.ts
│   │   └── templates/
│   │       ├── payslip.ts
│   │       └── employee-report.ts
│   ├── excel/
│   │   └── exporter.ts
│   ├── validations/
│   │   ├── employee.ts
│   │   ├── attendance.ts
│   │   ├── payroll.ts
│   │   └── leave.ts
│   └── utils.ts
├── store/                        # Zustand stores
│   ├── useAuthStore.ts
│   ├── useCompanyStore.ts
│   ├── useUIStore.ts
│   └── useFilterStore.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useCompany.ts
│   ├── useEmployees.ts
│   ├── useAttendance.ts
│   ├── usePayroll.ts
│   ├── useLeave.ts
│   ├── useDepartments.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
├── types/                        # TypeScript types
│   ├── supabase.ts              # Auto-generated from DB
│   ├── employee.ts
│   ├── attendance.ts
│   ├── payroll.ts
│   ├── leave.ts
│   ├── department.ts
│   └── index.ts
├── utils/                        # Utility functions
│   ├── constants.ts
│   ├── permissions.ts
│   └── formatters.ts
├── supabase/                     # Supabase configuration
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql
│   └── config.toml
├── public/                       # Static assets
│   ├── worknest-logo.svg
│   ├── worknest-icon.svg
│   ├── techohns-logo.svg
│   └── default-avatar.png
├── middleware.ts                 # Next.js middleware
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ DATABASE SCHEMA

### Core Tables

1. **companies** - Multi-tenant company information
2. **profiles** - User profiles extending auth.users
3. **departments** - Company departments
4. **job_titles** - Job positions
5. **employees** - Complete employee records
6. **attendance** - Daily attendance tracking
7. **leave_requests** - Leave management
8. **payroll** - Payroll records
9. **announcements** - Company announcements
10. **qr_codes** - QR code generation & validation
11. **audit_logs** - System audit trail

### Relationships

```
companies (1) ─── (many) profiles
companies (1) ─── (many) departments
companies (1) ─── (many) employees
companies (1) ─── (many) job_titles

departments (1) ─── (many) employees
departments (1) ─── (1) profiles (manager)

employees (1) ─── (1) profiles
employees (1) ─── (many) attendance
employees (1) ─── (many) leave_requests
employees (1) ─── (many) payroll
employees (1) ─── (1) employees (manager, self-join)

job_titles (1) ─── (many) employees
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### User Roles & Permissions

| Feature | Super Admin | Main Admin | HR Admin | Manager | Employee |
|---------|-------------|------------|----------|---------|----------|
| View all companies | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage companies | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ (limited) |
| Create employees | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit employees | ✅ | ✅ | ✅ | ❌ | ❌ |
| View employees | ✅ | ✅ | ✅ | 👁️ | Self only |
| Delete employees | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage departments | ✅ | ✅ | ✅ | ❌ | ❌ |
| View attendance | ✅ | ✅ | ✅ | 👁️ | Self only |
| Generate QR codes | ✅ | ✅ | ❌ | ❌ | ❌ |
| View payroll | ✅ | ✅ | ✅ | ❌ | ❌ |
| Process payroll | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve leave | ✅ | ✅ | ✅ | ❌ | ❌ |
| Request leave | ❌ | ❌ | ❌ | ❌ | ✅ |
| Post announcements | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage users | ✅ | ✅ | ❌ | ❌ | ❌ |
| System settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Audit logs | ✅ | ❌ | ❌ | ❌ | ❌ |

### Auth Flow

1. **Login**: Email/Username/Employee ID + Password
2. **First Login**: Forced password change
3. **JWT Claims**: user_id, company_id, role
4. **Session**: HTTP-only cookies via Supabase
5. **Logout**: Clear session + redirect to login

---

## 🎨 COMPONENT LIBRARY

### Layout Components
- `AppSidebar` - Collapsible navigation sidebar
- `AppHeader` - Sticky header with company branding
- `AppFooter` - Footer with TechOhns branding
- `DashboardLayout` - Main layout wrapper

### Data Display
- `DataTable` - Advanced table with sorting, filtering, pagination
- `MetricCard` - KPI display cards
- `ChartCard` - Chart containers
- `StatusBadge` - Status indicators
- `RoleBadge` - Role badges

### Forms
- `EmployeeForm` - Multi-step employee creation
- `PayrollForm` - Payroll entry
- `LeaveForm` - Leave request
- `FilterBar` - Advanced filtering
- `SearchBar` - Live search
- `DateRangePicker` - Date selection

### Overlays
- `EmployeeDrawer` - Employee details panel
- `QRScanner` - QR code scanner modal
- `PrintView` - Print preview

### Feedback
- `EmptyState` - No data state
- `ErrorState` - Error handling
- `LoadingState` - Loading skeletons
- `Toast` - Notifications

---

## 🚀 DEPLOYMENT

### Vercel Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Add environment variables
- Deploy

3. **Environment Variables in Vercel**
Add all variables from `.env.local` to Vercel:
- Project Settings > Environment Variables
- Add each variable
- Redeploy

4. **Custom Domain** (optional)
- Project Settings > Domains
- Add your domain
- Configure DNS

### Post-Deployment Checklist
- [ ] Test authentication
- [ ] Verify RLS policies
- [ ] Test file uploads
- [ ] Check email sending
- [ ] Test QR code generation
- [ ] Verify all CRUD operations
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Test multi-tenancy isolation
- [ ] Verify role permissions

---

## 💻 DEVELOPMENT WORKFLOW

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Component Creation
1. Create component in appropriate folder
2. Export from index file
3. Add types/interfaces
4. Write JSDoc comments
5. Test component

### Database Changes
1. Write migration SQL
2. Test locally
3. Push to Supabase
4. Update TypeScript types
5. Test in app

### Adding Features
1. Create types
2. Update database schema
3. Create API route/server action
4. Build UI components
5. Add to navigation
6. Test thoroughly

---

## 📝 BEST PRACTICES

### Security
- Always use RLS policies
- Validate all inputs
- Sanitize user data
- Use prepared statements
- Implement rate limiting
- Log security events

### Performance
- Use server components when possible
- Implement pagination
- Lazy load images
- Debounce search inputs
- Cache frequently accessed data
- Optimize database queries
- Use indexes properly

### UX
- Show loading states
- Provide clear error messages
- Implement keyboard navigation
- Ensure accessibility (ARIA labels)
- Test on all screen sizes
- Use optimistic updates

### Code Quality
- Write unit tests
- Document complex logic
- Keep components small
- Avoid prop drilling
- Use custom hooks
- Follow DRY principle

---

## 📞 SUPPORT & CONTACT

For technical support or inquiries:

**TechOhns**
Location: Lusaka, Zambia
Established: 2024

Developers:
- Pumulo Mubiana: +260975271902
- Samuel Wakumelo: +260971632781

LinkedIn:
- [Pumulo Mubiana](https://www.linkedin.com/in/pumulo-mubiana)
- [Samuel Wakumelo](https://www.linkedin.com/in/samuel-wakumelo)

---

## 📄 LICENSE

Copyright © 2024 TechOhns. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

**Built with ❤️ by TechOhns in Lusaka, Zambia**
