"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, History, Settings } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const [mounted, setMounted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle smooth page transitions
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.style.transform = 'scale(0.98)'
    
    // Remove any breadcrumb containers that might exist
    const breadcrumbs = document.querySelectorAll('.MuiBreadcrumbs-root, .breadcrumbs, [aria-label="breadcrumb"]')
    breadcrumbs.forEach(el => el.remove())
    
    setTimeout(() => {
      target.style.transform = ''
      router.push(href)
    }, 150)
  }
  
  // Handle hover with delay
  const handleMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current)
    }
    setIsExpanded(true)
  }
  
  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setIsExpanded(false)
    }, 150) // Small delay before collapsing
  }
  
  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (leaveTimeout.current) {
        clearTimeout(leaveTimeout.current)
      }
    }
  }, [])

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "History",
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  if (!mounted) return null

  return (
    <aside
      className={`relative h-screen flex flex-col border-r border-border/40 bg-gradient-to-b from-background/95 via-background/90 to-background/95 backdrop-blur-2xl shadow-lg shadow-black/10 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'width',
        transform: 'translateZ(0)',
      }}
    >
      {/* Header with logo/branding */}
      <div className="h-20 flex items-center px-4 border-b border-border/30 bg-background/10">
        <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <span className="text-sm font-semibold gradient-text whitespace-nowrap">Dashboard</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-3">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={(e) => handleNavigation(e, item.href)}
              className="block"
            >
              <div
                className={`flex items-center rounded-xl px-3 py-2 overflow-hidden transition-colors duration-200 ease-out ${
                  active
                    ? "bg-primary/15 text-primary shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20"
                }`}
              >
                <span className="flex-shrink-0" style={{ transform: 'translateZ(0)' }}>
                  {item.icon}
                </span>
                <div className="ml-2 overflow-hidden">
                  <span
                    className={`inline-block text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out ${
                      isExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer hint */}
      {isExpanded && (
        <div className="px-4 py-3 border-t border-border/30 text-[11px] text-muted-foreground/80 text-center bg-background/5">
          Hover to expand/collapse
        </div>
      )}
    </aside>
  )
}
