# FounderOS - Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Automatic Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/founderos)

### 2. Manual Deployment Steps

#### Step 1: Fork/Clone Repository
- Fork this repository to your GitHub account
- Or clone locally: `git clone [your-repo-url]`

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js - no configuration needed

#### Step 3: Configure Environment Variables
In your Vercel project dashboard, add these environment variables:

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:password@host:port/database
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
```

#### Step 4: Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your application
- Your app will be available at `https://your-app-name.vercel.app`

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the database to initialize

### 2. Run Database Scripts
In your Supabase SQL Editor, run these scripts in order:

1. `scripts/001_create_users_and_profiles.sql`
2. `scripts/002_create_startup_ideas.sql`
3. `scripts/003_create_mvp_projects.sql`
4. `scripts/004_create_pitch_decks.sql`
5. `scripts/005_create_founder_network.sql`
6. `scripts/006_create_legal_documents.sql`

### 3. Configure Authentication
1. In Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel domain to "Site URL": `https://your-app-name.vercel.app`
3. Add to "Redirect URLs": `https://your-app-name.vercel.app/**`

## AI Service Setup (Google Gemini)

### 1. Get API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Add to Vercel
1. In Vercel Dashboard → Settings → Environment Variables
2. Add `GEMINI_API_KEY` with your copied key
3. Redeploy your application

## Troubleshooting

### Common Issues:

**Build Errors:**
- Ensure all environment variables are set
- Check TypeScript errors: `npx tsc --noEmit`
- Verify build locally: `npm run build`

**Supabase Connection:**
- Verify URL and keys are correct
- Check database scripts have been run
- Confirm authentication settings

**AI Features Not Working:**
- Verify Gemini API key is valid
- Check API quotas in Google Cloud Console
- Monitor Vercel function logs

### Vercel-Specific Optimizations:
- ✅ API routes optimized for Vercel Functions
- ✅ Build configuration for production
- ✅ Memory and timeout settings configured
- ✅ Static generation where possible
- ✅ Performance optimizations enabled

### Support:
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)