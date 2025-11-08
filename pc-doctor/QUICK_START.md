# PC Doctor - Quick Start Guide

Get PC Doctor running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenRouter account with credits

## Setup Steps

### 1. Install Dependencies

```bash
cd pc-doctor
npm install
```

### 2. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get your Project URL and anon key from Settings > API
3. Run this SQL in SQL Editor:

```sql
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  system_specs JSONB NOT NULL,
  problem_description TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagnoses"
  ON diagnoses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON diagnoses FOR INSERT WITH CHECK (auth.uid() = user_id);
```

4. Disable email confirmation: Authentication > Settings > Email Auth > Toggle OFF "Enable email confirmations"

### 3. Set Up OpenRouter

1. Create account at [openrouter.ai](https://openrouter.ai)
2. Add credits ($5 minimum recommended)
3. Generate API key from Keys section

### 4. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENROUTER_API_KEY=your_openrouter_key
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the Application

1. **Sign Up**: Create an account at `/signup`
2. **Login**: Sign in at `/login`
3. **Diagnose**: Go to `/dashboard` and enter a problem
4. **Get Results**: View AI-generated diagnosis and solutions

## Example Problem to Test

```
My computer is running very slow. It takes 5 minutes to boot up,
and programs freeze frequently. The fan is also very loud.
```

## Common Issues

**"Unauthorized" error**: Make sure you're logged in

**"Invalid API key"**: Check your OpenRouter API key in `.env.local`

**Database errors**: Verify the SQL table was created in Supabase

**Styles not loading**: Clear `.next` folder and restart: `rm -rf .next && npm run dev`

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

## File Structure

```
pc-doctor/
├── src/
│   ├── app/
│   │   ├── api/diagnose/route.ts    # AI diagnosis endpoint
│   │   ├── dashboard/page.tsx       # Main app interface
│   │   ├── login/page.tsx           # Login page
│   │   ├── signup/page.tsx          # Signup page
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── ui/                      # ShadCN components
│   │   └── theme-toggle.tsx         # Theme switcher
│   └── lib/supabase/                # Supabase clients
└── .env.local                       # Your credentials
```

## Key Features

✅ User authentication with Supabase  
✅ AI-powered diagnosis with OpenRouter  
✅ System specs input (CPU, GPU, RAM, OS, Storage)  
✅ Step-by-step solutions  
✅ Dark/light mode with glass morphism  
✅ Responsive design  
✅ Preventive maintenance tips  

## Support

Need help? Check:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [README.md](README.md) - Full documentation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

---

**Ready to diagnose!** 🚀
