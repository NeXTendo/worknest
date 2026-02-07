# WorkNest

## Home to every workforce

<p align="center">
  <img src="./public/worknest-logo.png" alt="WorkNest Logo" width="180"/>
</p>

WorkNest is a multi-tenant employee management system built with Next.js and Supabase.

It brings employees, attendance, payroll, leave management, departments, and internal communication into one system, designed to run multiple companies from a single codebase with strict data isolation.

---

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, Storage, Realtime)
- Zustand
- React Hook Form + Zod
- TanStack Table
- Recharts
- Resend
- Vercel

---

## Features

### Multi-Tenancy
- Company isolation using `company_id`
- Enforced by Supabase Row Level Security
- JWT contains role and company claims

### Access Control
- Super Admin → Employee role hierarchy
- Route protection with middleware
- Role-based UI and API access

### Employee Management
- Full CRUD
- Rich profiles (personal, employment, bank, contacts, documents)
- Search, filters, pagination
- Bulk actions
- Photo uploads

### Attendance
- QR-based check in/out
- Automatic work hours and overtime calculation
- Table, calendar, and chart views
- Export support

### Leave Management
- Employee requests
- Approval workflow
- Leave balance tracking
- Conflict detection
- Email notifications

### Payroll
- Automated calculations
- Bonuses and deductions
- Payslip generation
- Department summaries

### Departments
- Department CRUD
- Job title structure
- Department heads
- Employee counts

### Announcements
- Company-wide or targeted
- Priority and pinned posts
- Attachments
- Read receipts

### White-Label
Each company can set:
- Name
- Logo
- Brand colors

---

## Roles

| Role | Description |
|------|-------------|
| Super Admin | Manages all companies |
| Main Admin | Full control of a company |
| HR Admin | Employees, payroll, leave |
| Manager | Team oversight |
| Employee | Self-service access |

---

## Project Structure

```
app/            Next.js routes
components/     UI and feature components
lib/            Utilities and configs
store/          Zustand state
hooks/          Custom hooks
types/          Type definitions
supabase/       SQL migrations and RLS policies
```

---

## Local Setup

### Requirements
- Node 18+
- Supabase project
- Resend account

### Install

```
git clone <repo-url>
cd worknest
npm install

cp .env.example .env.local
# add your keys

npm run db:push
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

---

## Security

- Row Level Security on all tables
- JWT with company and role claims
- Middleware route guards
- Zod input validation
- Secure headers via Vercel

---

## Deployment

Push to GitHub → Import into Vercel → Add env vars → Deploy.

---

## Author

**Pumulo Mubiana**  
Lusaka, Zambia  
https://www.linkedin.com/in/pumulo-mubiana

---

## License

Proprietary — TechOhns, 2024.
