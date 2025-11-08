# PC Doctor

An innovative web application that empowers users to diagnose and resolve computer technical issues independently using AI-powered solutions. Built with Next.js, Supabase, and OpenRouter API.

## Features

### Phase 1 (MVP) - Currently Implemented

- **AI Diagnosis**: Get AI-generated solutions for computer problems using OpenRouter API
- **System Specifications Input**: Provide detailed system specs (CPU, GPU, RAM, OS, Storage)
- **Multi-factor Analysis**: Cross-reference symptoms with system specs for accurate diagnosis
- **User Authentication**: Secure sign-up/login with Supabase Auth
- **Step-by-Step Solutions**: Clear, actionable instructions for common computer issues
- **Responsive Design**: Beautiful, mobile-friendly interface with glass morphism effects
- **Dark/Light Mode**: Toggle between dark and light themes with smooth transitions

## Tech Stack

- **Frontend**: React + Next.js 15 (App Router)
- **UI Library**: Tailwind CSS v4 + ShadCN UI
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI Service**: OpenRouter API (GPT-4o-mini)
- **Deployment**: Vercel
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- A Supabase account ([supabase.com](https://supabase.com))
- An OpenRouter API key ([openrouter.ai](https://openrouter.ai))

## Setup Instructions

### 1. Clone the Repository

```bash
cd pc-doctor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon/public key
4. In your Supabase project, create a table for diagnoses:

```sql
CREATE TABLE diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  system_specs JSONB,
  problem_description TEXT,
  diagnosis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own diagnoses
CREATE POLICY "Users can view their own diagnoses"
  ON diagnoses FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own diagnoses
CREATE POLICY "Users can insert their own diagnoses"
  ON diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 4. Set Up OpenRouter

1. Create an account at [openrouter.ai](https://openrouter.ai)
2. Generate an API key from your dashboard
3. Add credits to your account (required for API usage)

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Sign Up**: Create an account on the signup page
2. **Sign In**: Log in with your credentials
3. **Enter System Specs**: Provide your computer specifications (optional but recommended)
4. **Describe Problem**: Write a detailed description of your technical issue
5. **Get Diagnosis**: Click "Diagnose Problem" to receive AI-powered analysis
6. **Follow Steps**: Implement the suggested solution steps carefully
7. **Review Tips**: Check preventive maintenance tips to avoid future issues

### For Developers

#### Project Structure

```
pc-doctor/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── diagnose/
│   │   │       └── route.ts          # OpenRouter API integration
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main diagnosis interface
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup page
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles with glass morphism
│   ├── components/
│   │   ├── ui/                       # ShadCN UI components
│   │   ├── providers/
│   │   │   └── theme-provider.tsx    # Theme context provider
│   │   └── theme-toggle.tsx          # Dark/light mode toggle
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts             # Supabase client (browser)
│   │       ├── server.ts             # Supabase client (server)
│   │       └── middleware.ts         # Auth middleware
│   └── middleware.ts                 # Next.js middleware
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

#### Key Components

- **Authentication**: Supabase Auth with middleware protection
- **API Routes**: Server-side API route for OpenRouter integration
- **Theme System**: next-themes with dark/light mode support
- **Glass Morphism**: Custom CSS classes for frosted glass effects
- **Type Safety**: Full TypeScript support throughout

## Design System

### Color Palette

**Light Mode:**
- Background: Soft white with warm orange undertones
- Accent: Vibrant orange (#FF6B35)
- Text: Charcoal gray

**Dark Mode:**
- Background: Deep near-black (#1A1A1A)
- Accent: Light yellow (#F4E04D)
- Text: Crisp white

### UI Elements

- Glass morphism effects with backdrop blur
- Smooth animations and transitions
- Floating panels and cards
- Terminal-inspired code sections
- Progress indicators with accent colors

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel
```

### Environment Variables in Production

Make sure to add all environment variables from `.env.local` to your Vercel project settings.

## Future Enhancements (Roadmap)

### Phase 2
- Probability scoring for diagnoses
- Skill level adaptation (Beginner/Intermediate/Advanced)
- Manual script generation (batch/PowerShell/shell)
- Solution difficulty toggle
- Progress save & resume

### Phase 3
- Differential diagnosis with multiple causes
- Automated fix files generation
- Visual guides integration
- Video tutorial links
- Confidence visualization

### Phase 4
- Community solution ratings
- Export solutions as PDF
- Multi-language support

## Troubleshooting

### Common Issues

**Authentication not working:**
- Verify Supabase URL and keys in `.env.local`
- Check Supabase dashboard for authentication settings
- Ensure email confirmation is disabled for development

**AI diagnosis failing:**
- Verify OpenRouter API key is correct
- Check OpenRouter account has sufficient credits
- Review API logs in OpenRouter dashboard

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is 18+

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Supabase and OpenRouter documentation

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [ShadCN UI](https://ui.shadcn.com)
- Authentication by [Supabase](https://supabase.com)
- AI powered by [OpenRouter](https://openrouter.ai)
- Icons from [Lucide](https://lucide.dev)

---

**PC Doctor** - Making technical troubleshooting accessible to everyone.
