# WorkNest
## Home to every workforce

<div align="center">
  <img src="./public/worknest-logo.svg" alt="WorkNest Logo" width="200"/>
  
  **Enterprise Employee Management System**
  
  Multi-tenant • Secure • Scalable • Production-ready
  
  [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  
</div>

---

## 🌟 Overview

WorkNest is a comprehensive, enterprise-grade Employee Management System designed for modern businesses. Built with cutting-edge technologies, it provides everything you need to manage your workforce efficiently.

### Key Features

✅ **Multi-tenant Architecture** - Multiple companies, complete isolation  
✅ **Role-Based Access Control** - 5 permission levels (Super Admin to Employee)  
✅ **Advanced Employee Management** - Complete CRUD with rich profiles  
✅ **QR-Based Attendance** - Modern check-in/out system  
✅ **Payroll Processing** - Automated calculations & payslip generation  
✅ **Leave Management** - Request, approve, track leave  
✅ **Department Management** - Organize by departments & job titles  
✅ **Analytics Dashboard** - Real-time insights & charts  
✅ **Announcements** - Company-wide communication  
✅ **White-Label Ready** - Custom branding per company  
✅ **Mobile Responsive** - Works on all devices  
✅ **Production Security** - RLS, JWT, audit logs  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ 
- npm 9.6.7+
- Supabase account
- Resend account (for emails)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd worknest

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:3000

📖 **Full setup guide**: See [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | SSR, routing, layouts, performance |
| **Language** | TypeScript | Type safety, developer experience |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **UI Library** | shadcn/ui | Accessible, customizable components |
| **State** | Zustand | Lightweight, fast state management |
| **Tables** | TanStack Table | Advanced filtering, sorting, pagination |
| **Charts** | Recharts | Beautiful, interactive charts |
| **Forms** | React Hook Form + Zod | Validation, type-safe forms |
| **Backend** | Supabase | Auth, Database, Storage, Realtime |
| **Database** | PostgreSQL | Robust, relational database |
| **Email** | Resend | Transactional emails |
| **Hosting** | Vercel | Zero-config deployment |

---

## 📊 Features Overview

### 1️⃣ Dashboard
- Executive KPIs & metrics
- Interactive charts (attendance, payroll, leave)
- Recent activities feed
- Quick actions panel
- Department performance

### 2️⃣ Employee Management
- **CRUD operations** with validation
- **Advanced search** with live updates
- **Multi-filter** by department, status, type, date
- **Pagination** (10, 25, 50, 100 per page)
- **Employee drawer** for quick view
- **Bulk actions** (export, email, deactivate)
- **Photo upload** with automatic URL conversion
- Complete profiles:
  - Personal info
  - Employment details
  - Bank information
  - Health & insurance
  - Emergency contacts
  - Documents & certifications

### 3️⃣ Attendance System
- **QR code** check-in/out
- Daily QR generation by admins
- Automatic work hours calculation
- Overtime tracking
- Late arrival monitoring
- Multiple views: Table, Calendar, Charts
- Export to Excel/PDF

### 4️⃣ Leave Management
- Employee self-service requests
- HR approval workflow
- Leave types: Annual, Sick, Maternity, Paternity, Unpaid, Compassionate
- Balance tracking
- Calendar view
- Conflict detection
- Email notifications

### 5️⃣ Payroll
- Automated calculations
- Bonus & deduction management
- Tax & pension calculations
- Bulk processing
- Payslip generation
- Export & print
- Department summaries

### 6️⃣ Departments
- Full CRUD operations
- Budget tracking
- Employee count
- Department head assignment
- Operations tracking
- Job title hierarchy

### 7️⃣ Announcements
- Company-wide or targeted
- Priority levels
- Pinned announcements
- File attachments
- Read receipts
- Expiry dates

### 8️⃣ Security
- **Row Level Security (RLS)** at database level
- **JWT authentication** with custom claims
- **Password policies** & forced resets
- **Audit logging** for compliance
- **IP tracking** for security
- **HTTPS** enforcement
- **CSRF & XSS** protection

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Super Admin** | Platform owner - manage all companies |
| **Main Admin** | Company owner - full control within company |
| **HR Admin** | Manage employees, payroll, leave |
| **Manager** | View team data, approve requests |
| **Employee** | View own data, request leave, log attendance |

---

## 🎨 Branding

### WorkNest Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| **Primary** | Teal | `#14B8A6` |
| **Dark Background** | Navy | `#0F172A` |
| **Light Background** | Soft Gray | `#F8FAFC` |
| **Success** | Emerald | `#10B981` |
| **Warning** | Amber | `#F59E0B` |
| **Danger** | Rose | `#F43F5E` |

### White-Label Support
Each company can customize:
- Company name
- Logo
- Primary color
- Secondary color
- Accent color

The entire UI adapts to company branding automatically.

---

## 📁 Project Structure

```
worknest/
├── app/               # Next.js app directory
│   ├── (auth)/        # Authentication pages
│   ├── (dashboard)/   # Main dashboard
│   └── (platform)/    # Super admin platform
├── components/        # React components
│   ├── ui/            # shadcn/ui components
│   ├── layout/        # Layout components
│   ├── employees/     # Employee components
│   ├── attendance/    # Attendance components
│   └── shared/        # Shared components
├── lib/               # Libraries & utilities
├── store/             # Zustand state management
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
└── supabase/          # Database migrations
```

---

## 🔐 Security

WorkNest implements enterprise-grade security:

### Database Level
- **Row Level Security (RLS)** policies on all tables
- **Multi-tenant isolation** via company_id
- **JWT claims** (user_id, company_id, role)
- **Automatic company_id** injection

### Application Level
- **Middleware** auth checks
- **Route guards** with role verification
- **Input validation** (Zod schemas)
- **XSS prevention** (sanitization)
- **CSRF protection** (SameSite cookies)

### Infrastructure
- **HTTPS** only
- **Security headers** (CSP, HSTS, etc.)
- **Rate limiting** (Vercel)
- **DDoS protection** (Vercel)

---

## 📈 Performance

### Optimizations
- Server-side rendering (SSR)
- Incremental static regeneration (ISR)
- Image optimization (Next/Image)
- Code splitting & lazy loading
- Database indexes on key columns
- Query optimization with Supabase
- Debounced search inputs
- Pagination for large datasets

### Metrics
- Lighthouse score: 90+
- First contentful paint: <1.5s
- Time to interactive: <3s
- Largest contentful paint: <2.5s

---

## 🌍 Multi-Tenancy

### How It Works
1. Each company has a unique `company_id`
2. All data tables include `company_id`
3. RLS policies enforce data isolation
4. JWT includes `company_id` claim
5. Queries automatically filter by company

### Benefits
- ✅ Complete data isolation
- ✅ Impossible to access other company data
- ✅ Single codebase for all companies
- ✅ Cost-efficient (shared infrastructure)
- ✅ Easy to scale

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy on Vercel
# 1. Import project
# 2. Add environment variables
# 3. Deploy
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
```

### Post-Deployment
- Configure custom domain
- Setup SSL certificate (automatic on Vercel)
- Enable analytics (optional)
- Configure error monitoring (Sentry)

---

## 📚 Documentation

- **[Full Documentation](./DOCUMENTATION.md)** - Complete guide
- **[Database Schema](./supabase/migrations/)** - SQL migrations
- **[API Reference](./app/api/)** - API endpoints
- **[Component Library](./components/)** - UI components

---

## 🤝 Contributing

This is a proprietary project developed by TechOhns. Contributions are managed internally.

For feature requests or bug reports, contact the development team.

---

## 📞 Support

**TechOhns**  
Location: Lusaka, Zambia  
Established: 2024

**Developers:**
- Pumulo Mubiana: +260975271902  
  [LinkedIn](https://www.linkedin.com/in/pumulo-mubiana)
- Samuel Wakumelo: +260971632781  
  [LinkedIn](https://www.linkedin.com/in/samuel-wakumelo)

---

## 📄 License

Copyright © 2024 TechOhns. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [TanStack Table](https://tanstack.com/table)

---

<div align="center">
  
  **Powered by TechOhns**
  
  Building the future of workforce management in Africa
  
  🇿🇲 Made in Lusaka, Zambia
  
</div>
#   w o r k n e s t  
 