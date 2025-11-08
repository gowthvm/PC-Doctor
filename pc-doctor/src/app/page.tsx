"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu,
  HardDrive,
  Gauge
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      <main className="relative z-10 animate-fade-in pt-8">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
            <Badge className="glass-card px-4 py-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 mr-2 text-foreground" />
              Powered by Advanced AI Technology
            </Badge>
            
            <div className="p-5 rounded-2xl glass-card animate-pulse-slow">
              <Activity className="h-20 w-20 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              PC Doctor
            </h1>
            
            <p className="text-2xl md:text-3xl font-semibold text-primary">
              AI-Powered Computer Diagnostics
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Diagnose and resolve computer technical issues with personalized, step-by-step solutions 
              tailored to your skill level. Say goodbye to expensive tech support and hello to instant, 
              intelligent problem-solving.
            </p>
            
            {!loading && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {user ? (
                  <Button asChild size="lg" className="text-lg px-10 h-14 group">
                    <Link href="/dashboard">
                      Launch App
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="text-lg px-10 h-14 group">
                      <Link href="/signup">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-lg px-10 h-14 glass-card">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-2xl">
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl font-bold text-primary">10min</div>
                <div className="text-sm text-muted-foreground mt-1">Avg. Solution Time</div>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="glass-card px-4 py-2 mb-4 text-foreground">
              <Zap className="h-4 w-4 mr-2 text-foreground" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Fix Your PC
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive diagnostic tools powered by cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">AI-Powered Diagnosis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI analyzes your system specs and symptoms to provide accurate, 
                context-aware diagnoses in seconds.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Safe Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every fix includes clear instructions, safety warnings, and undo steps 
                to protect your system from harm.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Skill-Level Adapted</h3>
              <p className="text-muted-foreground leading-relaxed">
                Solutions customized to your technical expertise, from complete beginner 
                to advanced power user.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <Terminal className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Command Examples</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get ready-to-use commands and scripts for quick fixes, with detailed 
                explanations of what each does.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <Gauge className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Confidence Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                See how confident the AI is about each diagnosis with transparent 
                probability scores and alternative solutions.
              </p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 w-fit">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Preventive Tips</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn how to prevent future issues with personalized maintenance 
                recommendations and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="glass-card px-4 py-2 mb-4 text-foreground">
              <TrendingUp className="h-4 w-4 mr-2 text-foreground" />
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Solutions in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From problem to solution in minutes, not hours
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="glass-card p-8 rounded-2xl space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold">Describe Your Problem</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enter your system specifications and describe the issue you're experiencing. 
                  Be as detailed as possible for the best results.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
            </div>
            
            <div className="relative">
              <div className="glass-card p-8 rounded-2xl space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold">AI Analyzes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced AI processes your information, cross-references with thousands 
                  of known issues, and generates a diagnosis.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
            </div>
            
            <div className="glass-card p-8 rounded-2xl space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold">Follow Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive step-by-step instructions tailored to your skill level. 
                Follow along and fix your issue with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="glass-card px-4 py-2 mb-4 text-foreground">
              <Users className="h-4 w-4 mr-2 text-foreground" />
              Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose PC Doctor?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Save time, money, and frustration with intelligent diagnostics
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-xl flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Save Money</h3>
                <p className="text-muted-foreground">
                  Avoid expensive tech support fees. Get professional-grade diagnostics for free.
                </p>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p className="text-muted-foreground">
                  Get instant solutions instead of waiting hours or days for tech support.
                </p>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Cpu className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Learn & Grow</h3>
                <p className="text-muted-foreground">
                  Understand your computer better with detailed explanations and preventive tips.
                </p>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl flex gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <HardDrive className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Stay Safe</h3>
                <p className="text-muted-foreground">
                  Every solution includes safety warnings and undo instructions to protect your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="glass-card p-12 md:p-16 rounded-3xl text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Fix Your PC?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have solved their computer problems with PC Doctor. 
              Get started for free today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-10 h-14 group">
                <Link href="/signup">
                  Start Diagnosing Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-10 h-14 glass-card">
                <Link href="/login">Sign In to Your Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t glass mt-20">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
              {/* Brand Section */}
              <div className="col-span-2 md:col-span-1 space-y-4 mb-4 md:mb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-base md:text-lg">PC Doctor</div>
                    <div className="text-xs text-muted-foreground">AI-Powered Diagnostics</div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground hidden md:block">
                  Instant, intelligent computer problem-solving powered by advanced AI technology.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Product</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li>
                    <Link href="#features" className="hover:text-primary transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="#benefits" className="hover:text-primary transition-colors">
                      Benefits
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Company</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-primary transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Resources</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 md:pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
                © 2024 PC Doctor. All rights reserved.
              </div>
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  GitHub
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Discord
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
