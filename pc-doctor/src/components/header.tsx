"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, LogOut, User, Menu, X, CheckCircle2, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const navRef = useRef<HTMLElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const closeMobileMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setIsClosing(false)
    }, 300) // Match animation duration
  }

  const handleNavClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault()
    setActiveSection(section)
    
    // Smooth scroll to section
    const element = document.getElementById(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const isActive = (section: string) => {
    return activeSection === section
  }

  // Update indicator position
  useEffect(() => {
    if (!navRef.current || !mounted || pathname !== "/") return

    const updateIndicator = () => {
      const activeLink = navRef.current?.querySelector('[data-active="true"]') as HTMLElement
      if (activeLink && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        setIndicatorStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          opacity: 1
        })
      } else {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 })
      }
    }

    // Update immediately and on resize
    updateIndicator()
    window.addEventListener('resize', updateIndicator)

    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeSection, mounted, pathname])

  useEffect(() => {
    setMounted(true)
    
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 glass border-b" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
              {mounted && <Activity className="h-6 w-6 text-primary" />}
              {!mounted && <div className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-xl font-bold">PC Doctor</h1>
              <p className="text-xs text-muted-foreground">AI Diagnostics</p>
            </div>
          </Link>
          
          {/* Navigation - Left aligned */}
          <nav ref={navRef} className="hidden md:flex items-center gap-1 flex-1 relative">
            {pathname === "/" && (
              <>
                <Link
                  href="#features"
                  onClick={(e) => handleNavClick("features", e)}
                  data-active={isActive("features")}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive("features") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => handleNavClick("how-it-works", e)}
                  data-active={isActive("how-it-works")}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive("how-it-works") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  href="#benefits"
                  onClick={(e) => handleNavClick("benefits", e)}
                  data-active={isActive("benefits")}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive("benefits") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Benefits
                </Link>
                
                {/* Sliding indicator */}
                <span
                  className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity
                  }}
                />
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glass"
            onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {mounted && <ThemeToggle />}
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Badge variant="outline" className="glass-card text-foreground gap-2 px-3 py-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-xs">{user.email}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="glass"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
            onClick={closeMobileMenu}
            style={{
              opacity: isClosing ? 0 : 1
            }}
          />
        )}

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-y-0 right-0 w-72 glass-card border-l border-primary/20 rounded-l-3xl shadow-2xl z-40 flex flex-col backdrop-blur-xl"
            style={{
              animation: isClosing 
                ? "slide-out-to-right 0.3s ease-out forwards" 
                : "slide-in-from-right 0.3s ease-out forwards"
            }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-base">PC Doctor</div>
                  <div className="text-xs text-muted-foreground">Menu</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              {!user && (
                <>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    Explore
                  </div>
                  <Link
                    href="#features"
                    className="flex items-center gap-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all py-3 px-3 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="flex items-center gap-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all py-3 px-3 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Activity className="h-4 w-4" />
                    How It Works
                  </Link>
                  <Link
                    href="#benefits"
                    className="flex items-center gap-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all py-3 px-3 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Benefits
                  </Link>
                  <div className="border-t border-border/50 my-4"></div>
                </>
              )}
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Company
              </div>
              <Link
                href="/about"
                className={`flex items-center gap-3 text-sm font-medium transition-all py-3 px-3 rounded-lg ${
                  isActive("/about") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={closeMobileMenu}
              >
                <User className="h-4 w-4" />
                About Us
              </Link>
              <Link
                href="/privacy"
                className={`flex items-center gap-3 text-sm font-medium transition-all py-3 px-3 rounded-lg ${
                  isActive("/privacy") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={closeMobileMenu}
              >
                <AlertCircle className="h-4 w-4" />
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className={`flex items-center gap-3 text-sm font-medium transition-all py-3 px-3 rounded-lg ${
                  isActive("/terms") 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={closeMobileMenu}
              >
                <CheckCircle2 className="h-4 w-4" />
                Terms of Service
              </Link>
              
              <div className="border-t border-border/50 mt-4 pt-4 flex flex-col gap-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-3">
                  Settings
                </div>
                <div className="px-3">
                  <ThemeToggle />
                </div>
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <div className="px-3">
                          <Badge variant="outline" className="glass-card text-foreground gap-2 px-3 py-2 w-full justify-start">
                            <User className="h-3.5 w-3.5" />
                            <span className="text-xs truncate">{user.email}</span>
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleLogout()
                            closeMobileMenu()
                          }}
                          className="glass w-full justify-start gap-3 px-3 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline" size="sm" className="w-full justify-start gap-3 px-3 py-3 rounded-lg">
                          <Link href="/login" onClick={closeMobileMenu}>
                            <User className="h-4 w-4" />
                            Sign In
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="w-full justify-start gap-3 px-3 py-3 rounded-lg">
                          <Link href="/signup" onClick={closeMobileMenu}>
                            <CheckCircle2 className="h-4 w-4" />
                            Get Started
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
