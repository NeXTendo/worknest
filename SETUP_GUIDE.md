# WorkNest - Complete Setup & Deployment Guide

**Copyright © 2024 TechOhns. All rights reserved.**

This guide will walk you through setting up WorkNest from scratch to production deployment.

---

## 📋 PRE-REQUISITES CHECKLIST

Before starting, ensure you have:

- [ ] Node.js 18.17.0 or higher installed
- [ ] npm 9.6.7 or higher installed
- [ ] Git installed and configured
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account (free tier works)
- [ ] Resend account (free tier works)
- [ ] Vercel account (free tier works)
- [ ] GitHub account

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Project Initialization

```bash
# Create project directory
mkdir worknest
cd worknest

# Initialize git
git init

# Copy all files from the WorkNest package
# (Copy the entire worknest/ folder you've been provided)

# Install dependencies
npm install
```

**Expected time**: 5-10 minutes

---

### Step 2: Supabase Database Setup

#### 2.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: WorkNest Production (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., eu-west-1)
4. Click "Create new project" (takes ~2 minutes)

#### 2.2 Get API Credentials

1. Go to Project Settings > API
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (very long string)
3. Go to Project Settings > Database
4. Copy:
   - **Service role key**: `eyJhbGc...` (very long string - KEEP SECRET!)

#### 2.3 Run Database Migrations

**Option A: Using Supabase CLI** (Recommended)

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Option B: Manual SQL Execution**

1. Go to Supabase Dashboard > SQL Editor
2. Open `supabase/migrations/20240101000000_initial_schema.sql`
3. Copy the entire file contents
4. Paste into SQL Editor
5. Click "Run" (⚡ button)
6. Wait for execution to complete (~30 seconds)

#### 2.4 Configure Storage

1. Go to Storage in Supabase Dashboard
2. Click "New bucket"
3. Create bucket:
   - **Name**: `worknest-avatars`
   - **Public**: Yes
4. Go to Policies tab
5. Add policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'worknest-avatars');

-- Allow public read
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'worknest-avatars');

-- Allow users to update own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'worknest-avatars');

-- Allow users to delete own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'worknest-avatars');
```

**Expected time**: 10-15 minutes

---

### Step 3: Resend Email Setup

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email
4. Add domain or use testing domain:
   - **Testing**: `onboarding@resend.dev` (immediate, limited)
   - **Production**: Add your domain and verify DNS
5. Go to API Keys
6. Create new API key
7. Copy the key (starts with `re_`)

**Expected time**: 5-10 minutes

---

### Step 4: Environment Variables

Create `.env.local` file in project root:

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Resend
RESEND_API_KEY=re_...your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=WorkNest
NEXT_PUBLIC_APP_DESCRIPTION=Home to every workforce

# Security (generate random string)
NEXTAUTH_SECRET=your-random-secret-key-here-use-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

**Expected time**: 2-3 minutes

---

### Step 5: Create Super Admin Account

Run this SQL in Supabase SQL Editor:

```sql
-- 1. Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'pumulomamubiana@gmail.com',  -- Change this to your email
  crypt('Admin@techohn01', gen_salt('bf')),  -- Change this password!
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- 2. Get the user ID (run this separately to get the ID)
SELECT id FROM auth.users WHERE email = 'pumulomamubiana@gmail.com';

-- 3. Create profile (replace USER_ID_HERE with the ID from step 2)
INSERT INTO public.profiles (
  id,
  company_id,
  role,
  email,
  first_name,
  last_name,
  must_change_password
) VALUES (
  'eb3fdfd0-146f-4949-8616-9726ac046f91',  -- Replace with actual UUID from step 2
  '00000000-0000-0000-0000-000000000000',
  'super_admin',
  'pumulomamubiana@gmail.com',
  'Super',
  'Admin',
  false  -- Set to true if you want forced password change
);
```

**Expected time**: 3-5 minutes

---

### Step 6: Test Local Development

```bash
# Start development server
npm run dev
```

Visit http://localhost:3000

**Test checklist**:
- [ ] Home page loads
- [ ] Can navigate to /auth/login
- [ ] Can login with super admin credentials
- [ ] Dashboard loads after login
- [ ] Sidebar navigation works
- [ ] No console errors

**Expected time**: 5 minutes

---

### Step 7: Initial Company Setup

After logging in as super admin:

1. Go to Platform > Companies
2. Create your first company:
   - **Name**: Your company name (e.g., "TechOhns")
   - **Logo**: Upload company logo
   - **Primary Color**: #14B8A6 (or custom)
   - **Industry**: Technology (or relevant)
   - **Location**: Lusaka, Zambia

3. Create Main Admin user for the company
4. Switch to company view
5. Test employee creation workflow

**Expected time**: 10 minutes

---

## 🌐 DEPLOYMENT TO PRODUCTION

### Step 1: GitHub Setup

```bash
# Add all files
git add .

# Commit
git commit -m "Initial WorkNest setup"

# Create repository on GitHub
# Then add remote
git remote add origin https://github.com/your-username/worknest.git

# Push
git push -u origin main
```

---

### Step 2: Vercel Deployment

#### 2.1 Connect Project

1. Go to https://vercel.com
2. Click "Add New" > "Project"
3. Import from GitHub
4. Select your WorkNest repository
5. Click "Import"

#### 2.2 Configure Project

**Framework Preset**: Next.js  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`  
**Root Directory**: `./`

#### 2.3 Add Environment Variables

Add ALL variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-app.vercel.app
```

**IMPORTANT**: Change `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to your actual Vercel domain!

#### 2.4 Deploy

1. Click "Deploy"
2. Wait for build (~2-5 minutes)
3. Get your URL: `https://your-app.vercel.app`

---

### Step 3: Update Supabase URLs

1. Go to Supabase Dashboard
2. Authentication > URL Configuration
3. Add Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

---

### Step 4: Configure Custom Domain (Optional)

1. In Vercel Dashboard > Settings > Domains
2. Add your domain (e.g., `worknest.yourdomain.com`)
3. Configure DNS:
   - Type: CNAME
   - Name: worknest
   - Value: cname.vercel-dns.com
4. Wait for SSL certificate (~5 minutes)
5. Update environment variables with new domain

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Security
- [ ] All environment variables are set correctly
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Service role key is kept secret
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] RLS policies are active in Supabase

### Functionality
- [ ] Login/logout works
- [ ] Employee creation works
- [ ] File uploads work
- [ ] Email sending works
- [ ] QR generation works
- [ ] All CRUD operations work
- [ ] Search and filters work
- [ ] Charts render correctly

### Performance
- [ ] Lighthouse score > 90
- [ ] No console errors in production
- [ ] Images load properly
- [ ] Database queries are optimized

### User Experience
- [ ] Mobile responsive
- [ ] All navigation works
- [ ] Forms validate correctly
- [ ] Error messages are clear
- [ ] Loading states are shown

---

## 🔧 MAINTENANCE & UPDATES

### Database Backups

1. Go to Supabase Dashboard > Database > Backups
2. Enable automatic daily backups
3. Test restore procedure

### Monitoring

1. **Vercel**: Analytics tab (requests, errors, performance)
2. **Supabase**: Database tab (connections, queries)
3. **Resend**: Logs tab (email delivery)

### Regular Tasks

**Weekly**:
- Check error logs
- Review system performance
- Monitor storage usage

**Monthly**:
- Update dependencies: `npm update`
- Review security advisories
- Check backup integrity
- Review user feedback

---

## 🐛 TROUBLESHOOTING

### Login Issues

**Problem**: Can't login  
**Solutions**:
1. Check Supabase URL in environment variables
2. Verify user exists in auth.users table
3. Check password is correct
4. Clear browser cookies
5. Check network tab for errors

### Database Connection Errors

**Problem**: "Could not connect to database"  
**Solutions**:
1. Verify SUPABASE_URL is correct
2. Check Supabase project is running
3. Verify RLS policies don't block access
4. Check service role key is valid

### File Upload Failures

**Problem**: Images not uploading  
**Solutions**:
1. Check storage bucket exists
2. Verify storage policies are correct
3. Check file size limits
4. Verify bucket is public (for avatars)

### Email Not Sending

**Problem**: Welcome emails not received  
**Solutions**:
1. Verify RESEND_API_KEY is correct
2. Check email is not in spam
3. Verify sender domain is verified
4. Check Resend logs for errors

### Build Failures

**Problem**: Vercel deployment fails  
**Solutions**:
1. Check build logs for errors
2. Test build locally: `npm run build`
3. Verify all environment variables are set
4. Check TypeScript errors: `npm run type-check`

---

## 📞 SUPPORT

For technical support:

**TechOhns**  
Lusaka, Zambia

**Developers**:
- Pumulo Mubiana: +260975271902
- Samuel Wakumelo: +260971632781

**LinkedIn**:
- [Pumulo Mubiana](https://www.linkedin.com/in/pumulo-mubiana)
- [Samuel Wakumelo](https://www.linkedin.com/in/samuel-wakumelo)

---

## 📚 ADDITIONAL RESOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)

---

## 🎯 QUICK REFERENCE

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript

# Database
npm run db:generate      # Generate TypeScript types
npm run db:push          # Push migrations
npm run db:reset         # Reset database (CAUTION!)

# Formatting
npm run format           # Format code with Prettier
```

### Important URLs

- **Local Dev**: http://localhost:3000
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Resend Dashboard**: https://resend.com/emails

### Key Files

- **Environment**: `.env.local`
- **Database Schema**: `supabase/migrations/20240101000000_initial_schema.sql`
- **Main Config**: `next.config.js`
- **Tailwind Config**: `tailwind.config.js`
- **TypeScript Config**: `tsconfig.json`

---

**Built with ❤️ by TechOhns**  
**Copyright © 2024 TechOhns. All rights reserved.**
