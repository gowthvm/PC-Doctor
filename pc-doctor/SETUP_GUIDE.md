# PC Doctor - Complete Setup Guide

This guide will walk you through setting up PC Doctor from scratch, including all external services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [OpenRouter Setup](#openrouter-setup)
4. [Local Development Setup](#local-development-setup)
5. [Database Schema](#database-schema)
6. [Testing the Application](#testing-the-application)
7. [Deployment](#deployment)

## Prerequisites

### Required Software

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** ([Download](https://git-scm.com/))
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A code editor (VS Code recommended)

### Required Accounts

- **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)
- **OpenRouter Account** - Requires credits at [openrouter.ai](https://openrouter.ai)

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `pc-doctor` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project" and wait for setup (2-3 minutes)

### Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll need two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`
4. Keep these values handy for the `.env.local` file

### Step 3: Configure Authentication

1. Go to **Authentication** > **Providers** in the sidebar
2. Make sure **Email** provider is enabled
3. For development, disable email confirmation:
   - Go to **Authentication** > **Settings**
   - Scroll to **Email Auth**
   - Toggle OFF "Enable email confirmations"
   - Click "Save"

### Step 4: Create Database Tables

1. Go to **SQL Editor** in the sidebar
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create diagnoses table
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  system_specs JSONB NOT NULL,
  problem_description TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX diagnoses_user_id_idx ON diagnoses(user_id);
CREATE INDEX diagnoses_created_at_idx ON diagnoses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own diagnoses
CREATE POLICY "Users can view their own diagnoses"
  ON diagnoses FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own diagnoses
CREATE POLICY "Users can insert their own diagnoses"
  ON diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own diagnoses
CREATE POLICY "Users can update their own diagnoses"
  ON diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own diagnoses
CREATE POLICY "Users can delete their own diagnoses"
  ON diagnoses FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

### Step 5: Verify Database Setup

1. Go to **Table Editor** in the sidebar
2. You should see the `diagnoses` table listed
3. Click on it to view the structure

## OpenRouter Setup

### Step 1: Create an Account

1. Go to [openrouter.ai](https://openrouter.ai)
2. Click "Sign Up" or "Login"
3. You can sign up with:
   - Google account
   - GitHub account
   - Email and password

### Step 2: Add Credits

1. After logging in, click your profile icon (top right)
2. Go to **Keys** or **Credits**
3. Click "Add Credits"
4. Add at least $5 (recommended $10 for testing)
   - GPT-4o-mini costs approximately $0.15 per 1M input tokens
   - $5 will give you thousands of diagnoses
5. Complete the payment

### Step 3: Generate API Key

1. In your OpenRouter dashboard, go to **Keys**
2. Click "Create Key"
3. Give it a name: `pc-doctor-dev`
4. Click "Create"
5. **IMPORTANT**: Copy the API key immediately (starts with `sk-or-v1-...`)
6. Save it securely - you won't be able to see it again!

### Step 4: Test API Key (Optional)

You can test your API key with curl:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Local Development Setup

### Step 1: Navigate to Project

```bash
cd c:\Users\Gowtham\Desktop\PCD\pc-doctor
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- Tailwind CSS
- ShadCN UI components
- Supabase client
- And more...

### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
copy .env.example .env.local
```

2. Open `.env.local` in your code editor

3. Fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here

# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-...your-key-here
```

4. Save the file

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

### Step 5: Open in Browser

1. Open your browser
2. Go to [http://localhost:3000](http://localhost:3000)
3. You should see the PC Doctor landing page

## Database Schema

### Tables

#### `diagnoses`

Stores all diagnosis history for users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | Foreign key to auth.users |
| `system_specs` | JSONB | User's system specifications |
| `problem_description` | TEXT | User's problem description |
| `diagnosis_result` | JSONB | AI-generated diagnosis and solutions |
| `created_at` | TIMESTAMP | When the diagnosis was created |

#### Example Data Structure

**system_specs:**
```json
{
  "cpu": "Intel Core i7-10700K",
  "gpu": "NVIDIA RTX 3070",
  "ram": "16GB DDR4",
  "os": "Windows 11",
  "storage": "512GB NVMe SSD"
}
```

**diagnosis_result:**
```json
{
  "diagnosis": "System performance degradation due to high disk usage",
  "confidence": 85,
  "possibleCauses": [
    "Background processes consuming resources",
    "Disk fragmentation",
    "Insufficient RAM for current workload"
  ],
  "steps": [...],
  "preventiveTips": [...]
}
```

## Testing the Application

### Test 1: User Registration

1. Click "Get Started" on the landing page
2. Fill in:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Confirm Password: `testpassword123`
3. Click "Sign Up"
4. You should see "Account created successfully!"
5. You'll be redirected to the login page

### Test 2: User Login

1. Enter your test credentials
2. Click "Sign In"
3. You should be redirected to `/dashboard`

### Test 3: AI Diagnosis

1. On the dashboard, fill in system specs (optional):
   - CPU: `Intel Core i5-9400F`
   - GPU: `NVIDIA GTX 1660`
   - RAM: `8GB DDR4`
   - OS: `Windows 10`
   - Storage: `256GB SSD`

2. In the problem description, enter:
   ```
   My computer is running very slow. It takes 5 minutes to boot up,
   and programs freeze frequently. The fan is also very loud.
   ```

3. Click "Diagnose Problem"

4. Wait 5-10 seconds for AI analysis

5. You should see:
   - Diagnosis summary
   - Confidence score
   - Possible causes
   - Step-by-step solutions
   - Preventive tips

### Test 4: Theme Toggle

1. Click the sun/moon icon in the header
2. The theme should switch between light and dark mode
3. Notice the glass morphism effects

### Test 5: Logout

1. Click the logout icon in the header
2. You should be redirected to the home page
3. Try accessing `/dashboard` - you should be redirected to `/login`

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/pc-doctor.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENROUTER_API_KEY`

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

### Update Supabase Site URL

1. Go to your Supabase project
2. Navigate to **Authentication** > **URL Configuration**
3. Add your Vercel URL to **Site URL**
4. Add to **Redirect URLs**:
   - `https://your-project.vercel.app/**`

## Troubleshooting

### Issue: "Invalid API key" from OpenRouter

**Solution:**
- Verify your API key is correct in `.env.local`
- Check that your OpenRouter account has credits
- Make sure there are no extra spaces in the key

### Issue: "Unauthorized" when trying to diagnose

**Solution:**
- Make sure you're logged in
- Check browser console for errors
- Verify Supabase credentials are correct

### Issue: Signup not working

**Solution:**
- Check Supabase dashboard for authentication errors
- Verify email confirmation is disabled for development
- Check browser console for errors

### Issue: Database errors

**Solution:**
- Verify the `diagnoses` table exists in Supabase
- Check that RLS policies are set up correctly
- Review Supabase logs in the dashboard

### Issue: Styles not loading correctly

**Solution:**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`
- Clear browser cache

## Next Steps

1. **Customize the UI**: Modify colors, fonts, and layouts in `globals.css`
2. **Add Features**: Implement Phase 2 features from the roadmap
3. **Improve AI Prompts**: Refine the OpenRouter prompts for better diagnoses
4. **Add Analytics**: Integrate analytics to track usage
5. **Set Up Monitoring**: Add error tracking with Sentry or similar

## Support

If you encounter issues:

1. Check this guide thoroughly
2. Review the main README.md
3. Check Supabase documentation
4. Check OpenRouter documentation
5. Open an issue on GitHub

---

**Happy Coding!** 🚀
