import { Sidebar } from "@/components/sidebar"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Particles } from "@/components/ui/particles"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen">
      <AnimatedBackground />
      <Particles />
      <Sidebar />
      <main className="relative z-10 flex-1 overflow-auto transition-all duration-300 ease-in-out bg-background/50">
        {children}
      </main>
    </div>
  )
}
