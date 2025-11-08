# Getting Started with PC Doctor

Welcome! This guide will help you get PC Doctor up and running.

## 🎯 What You Need

Before starting, make sure you have:

- [ ] Node.js 18 or higher installed
- [ ] A Supabase account (free)
- [ ] An OpenRouter account with credits ($5 minimum)
- [ ] A code editor (VS Code recommended)
- [ ] Git (optional, for version control)

## 📋 Step-by-Step Setup

### Step 1: Verify Node.js Installation

Open your terminal and check your Node.js version:

```bash
node --version
```

You should see `v18.x.x` or higher. If not, download from [nodejs.org](https://nodejs.org/).

### Step 2: Navigate to Project

```bash
cd c:\Users\Gowtham\Desktop\PCD\pc-doctor
```

### Step 3: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes. You'll see a progress bar.

### Step 4: Set Up Supabase

#### 4.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Name**: `pc-doctor`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup

#### 4.2 Get API Credentials

1. In your project dashboard, click the **Settings** gear icon (bottom left)
2. Click **API** in the sidebar
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
4. Keep this tab open - you'll need these values soon!

#### 4.3 Create Database Table

1. Click **SQL Editor** in the sidebar (looks like `</>`)
2. Click **New query**
3. Copy and paste this entire SQL code:

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

-- Create indexes for better performance
CREATE INDEX diagnoses_user_id_idx ON diagnoses(user_id);
CREATE INDEX diagnoses_created_at_idx ON diagnoses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view their own diagnoses"
  ON diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
  ON diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON diagnoses FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

#### 4.4 Disable Email Confirmation (Development Only)

1. Click **Authentication** in the sidebar
2. Click **Settings** (under Authentication)
3. Scroll down to **Email Auth** section
4. Toggle **OFF** the "Enable email confirmations" switch
5. Click **Save**

This allows you to test without confirming emails during development.

### Step 5: Set Up OpenRouter

#### 5.1 Create Account

1. Go to [openrouter.ai](https://openrouter.ai)
2. Click "Sign In" (top right)
3. Sign up with:
   - Google account, OR
   - GitHub account, OR
   - Email and password

#### 5.2 Add Credits

1. After logging in, click your profile icon (top right)
2. Click **Credits** or **Billing**
3. Click **Add Credits**
4. Add at least **$5** (recommended: $10)
   - Each diagnosis costs about $0.0001-$0.0005
   - $5 = thousands of diagnoses
5. Complete payment with credit card

#### 5.3 Generate API Key

1. Click your profile icon again
2. Click **Keys** or **API Keys**
3. Click **Create Key**
4. Name it: `pc-doctor-development`
5. Click **Create**
6. **IMPORTANT**: Copy the key immediately!
   - It starts with `sk-or-v1-...`
   - You won't be able to see it again
   - Save it in a safe place

### Step 6: Configure Environment Variables

#### 6.1 Create .env.local File

In your project folder, create a new file called `.env.local`:

**Windows (PowerShell):**
```powershell
copy .env.example .env.local
```

**Windows (Command Prompt):**
```cmd
copy .env.example .env.local
```

#### 6.2 Edit .env.local

Open `.env.local` in your code editor and fill in your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-...
```

Replace:
- `https://xxxxx.supabase.co` with your Supabase Project URL
- `eyJhbGc...` with your Supabase anon key
- `sk-or-v1-...` with your OpenRouter API key

**Save the file!**

### Step 7: Start the Application

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

### Step 8: Open in Browser

1. Open your web browser
2. Go to: [http://localhost:3000](http://localhost:3000)
3. You should see the PC Doctor landing page! 🎉

## 🧪 Test the Application

### Test 1: Create an Account

1. Click **"Get Started"** button
2. Fill in:
   - **Email**: `test@example.com` (or your real email)
   - **Password**: `testpassword123`
   - **Confirm Password**: `testpassword123`
3. Click **"Sign Up"**
4. You should see: "Account created successfully!"
5. You'll be redirected to the login page

### Test 2: Sign In

1. Enter your credentials:
   - **Email**: `test@example.com`
   - **Password**: `testpassword123`
2. Click **"Sign In"**
3. You should be redirected to the dashboard

### Test 3: Run a Diagnosis

1. On the dashboard, fill in system specs (optional):
   - **CPU**: `Intel Core i5-9400F`
   - **GPU**: `NVIDIA GTX 1660`
   - **RAM**: `8GB DDR4`
   - **OS**: `Windows 10`
   - **Storage**: `256GB SSD`

2. In the problem description box, type:
   ```
   My computer is running very slow. It takes 5 minutes to boot up,
   and programs freeze frequently. The fan is also very loud.
   ```

3. Click **"Diagnose Problem"**

4. Wait 5-10 seconds (you'll see a loading spinner)

5. You should see:
   - ✅ Diagnosis summary
   - ✅ Confidence score
   - ✅ Possible causes
   - ✅ Step-by-step solutions
   - ✅ Preventive tips

### Test 4: Try Dark Mode

1. Click the sun/moon icon in the header
2. The theme should switch
3. Notice the beautiful glass morphism effects!

### Test 5: Logout

1. Click the logout icon (top right)
2. You should be redirected to the home page

## ✅ Success Checklist

You've successfully set up PC Doctor if:

- [ ] Application runs at http://localhost:3000
- [ ] You can create an account
- [ ] You can log in
- [ ] You can submit a diagnosis
- [ ] You receive AI-generated solutions
- [ ] Dark/light mode works
- [ ] You can log out

## 🚨 Troubleshooting

### Problem: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Problem: "Unauthorized" when diagnosing

**Solution:**
- Make sure you're logged in
- Check that your Supabase credentials are correct in `.env.local`
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Problem: "Invalid API key" from OpenRouter

**Solution:**
- Verify your OpenRouter API key in `.env.local`
- Make sure there are no extra spaces
- Check that your OpenRouter account has credits

### Problem: Can't create account

**Solution:**
- Check Supabase dashboard for errors
- Verify email confirmation is disabled
- Make sure the database table was created correctly

### Problem: Styles look broken

**Solution:**
```bash
rm -rf .next
npm run dev
```

### Problem: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

## 📚 Next Steps

Now that PC Doctor is running:

1. **Explore the UI**: Try different problems and see the AI responses
2. **Read the docs**: Check out `README.md` for full documentation
3. **Customize**: Modify colors, fonts, or features
4. **Deploy**: Follow `SETUP_GUIDE.md` to deploy to Vercel

## 🎓 Learn More

- **Full Documentation**: [README.md](README.md)
- **Detailed Setup**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Reference**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Quick Reference**: [QUICK_START.md](QUICK_START.md)

## 💡 Tips

- **Save your work**: Use Git to track changes
- **Test thoroughly**: Try different problem descriptions
- **Monitor costs**: Check OpenRouter usage in their dashboard
- **Stay updated**: Keep dependencies up to date with `npm update`

## 🆘 Need Help?

If you're stuck:

1. Check the troubleshooting section above
2. Review the error message carefully
3. Check browser console (F12) for errors
4. Review Supabase logs in the dashboard
5. Check OpenRouter dashboard for API errors

## 🎉 You're All Set!

Congratulations! PC Doctor is now running on your machine. Start diagnosing computer problems with AI! 🚀

---

**Happy diagnosing!** If you found this helpful, consider starring the project on GitHub.
