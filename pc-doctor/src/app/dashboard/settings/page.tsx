"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Settings, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase.auth, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
      toast.success("Logged out successfully")
    } catch (err) {
      console.error("Error logging out:", err)
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="relative z-10 container mx-auto px-4 py-8 lg:py-10 xl:py-12">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-10 xl:py-12 animate-fade-in">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Information */}
        <Card className="glass-card-premium rounded-2xl shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-base font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Account Status</p>
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-card-premium rounded-2xl shadow-xl border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="glass-card-premium rounded-2xl shadow-xl mt-6">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              More settings options will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Theme preferences</li>
              <li>• Notification settings</li>
              <li>• Privacy controls</li>
              <li>• Data export</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
