"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Search,
  History,
  Calendar,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface DiagnosisStep {
  step: number
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: string
  commands?: {
    windows?: string[]
    macos?: string[]
    linux?: string[]
  }
  warnings?: string[]
  windowsSettingsUri?: string
  windowsSettingsLabel?: string
}

interface DiagnosisResult {
  diagnosis: string
  confidence: number
  possibleCauses: string[]
  steps: DiagnosisStep[]
  preventiveTips: string[]
}

interface PastDiagnosis {
  id: string
  created_at: string
  problem_description: string
  diagnosis_result: DiagnosisResult
  system_specs: {
    cpu: string
    gpu: string
    ram: string
    os: string
    storage: string
  }
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [pastDiagnoses, setPastDiagnoses] = useState<PastDiagnosis[]>([])
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<PastDiagnosis[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [supabase.auth, router])

  const fetchPastDiagnoses = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching past diagnoses:", error)
        toast.error("Failed to load diagnosis history")
        return
      }

      setPastDiagnoses(data || [])
      setFilteredDiagnoses(data || [])
    } catch (err) {
      console.error("Error fetching past diagnoses:", err)
      toast.error("Failed to load diagnosis history")
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  // Fetch past diagnoses
  useEffect(() => {
    if (user) {
      fetchPastDiagnoses()
    }
  }, [user, fetchPastDiagnoses])

  // Filter diagnoses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDiagnoses(pastDiagnoses)
    } else {
      const filtered = pastDiagnoses.filter(diagnosis =>
        diagnosis.problem_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diagnosis.diagnosis_result.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (diagnosis.system_specs.cpu && diagnosis.system_specs.cpu.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (diagnosis.system_specs.gpu && diagnosis.system_specs.gpu.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (diagnosis.system_specs.os && diagnosis.system_specs.os.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredDiagnoses(filtered)
    }
  }, [searchQuery, pastDiagnoses])

  const deleteDiagnosis = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("diagnoses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting diagnosis:", error)
        toast.error("Failed to delete diagnosis")
        return
      }
      setPastDiagnoses(prev => prev.filter(d => d.id !== id))
      toast.success("Diagnosis deleted")
    } catch (err) {
      console.error("Error deleting diagnosis:", err)
      toast.error("Failed to delete diagnosis")
    }
  }

  const handleLoadDiagnosis = (diagnosis: PastDiagnosis) => {
    // Store the diagnosis in sessionStorage to pass to dashboard
    sessionStorage.setItem("loadedDiagnosis", JSON.stringify(diagnosis))
    router.push("/dashboard")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <div className="min-h-screen">
      <main className="relative z-10 container mx-auto px-4 py-8 lg:py-10 xl:py-12 animate-fade-in">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <History className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Diagnosis History</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage your past diagnoses
          </p>
        </div>

        {/* Search Bar */}
        <Card className="glass-card-premium rounded-2xl shadow-xl mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by problem, diagnosis, CPU, GPU, or OS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 glass rounded-xl h-12 text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredDiagnoses.length} of {pastDiagnoses.length} diagnoses
          </div>
        )}

        {/* Diagnoses List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="glass-card-premium rounded-2xl">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDiagnoses.length === 0 ? (
          <Card className="glass-card-premium rounded-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <History className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No diagnoses found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "You haven't run any diagnoses yet. Go to the dashboard to get started."}
              </p>
              {!searchQuery && (
                <Button asChild className="rounded-xl">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDiagnoses.map((diagnosis, idx) => (
              <Card
                key={diagnosis.id}
                className="glass-card-premium rounded-2xl cursor-pointer hover:shadow-lg hover:bg-primary/5 transition-all duration-300 ease-out group stagger-item"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Diagnosis Title */}
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {diagnosis.diagnosis_result.diagnosis}
                      </h3>

                      {/* Problem Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {diagnosis.problem_description}
                      </p>

                      {/* Date and Confidence */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(diagnosis.created_at)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {diagnosis.diagnosis_result.confidence}% Confidence
                        </Badge>
                      </div>

                      {/* System Specs Tags */}
                      <div className="flex flex-wrap gap-2">
                        {diagnosis.system_specs.cpu && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                            CPU: {diagnosis.system_specs.cpu.split(' ').slice(0, 2).join(' ')}
                          </Badge>
                        )}
                        {diagnosis.system_specs.os && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                            OS: {diagnosis.system_specs.os.split(' ').slice(0, 2).join(' ')}
                          </Badge>
                        )}
                        {diagnosis.system_specs.gpu && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                            GPU: {diagnosis.system_specs.gpu.split(' ').slice(0, 2).join(' ')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleLoadDiagnosis(diagnosis)}
                        className="rounded-lg gap-2 whitespace-nowrap btn-float"
                        size="sm"
                      >
                        Load
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteDiagnosis(diagnosis.id)
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive rounded-lg"
                        title="Delete diagnosis"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
