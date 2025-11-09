"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  RotateCcw, 
  Sparkles,
  Clock,
  Zap,
  Shield,
  Search,
  History,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X
} from "lucide-react"

interface DiagnosisStep {
  step: number
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: string
  commands?: string[]
  warnings?: string[]
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

// Progress status types
type DiagnosisStatus = 
  | "idle"
  | "analyzing"
  | "processing"
  | "generating"
  | "completed"
  | "error"

export default function DashboardPage() {
  const [cpu, setCpu] = useState("")
  const [gpu, setGpu] = useState("")
  const [ram, setRam] = useState("")
  const [os, setOs] = useState("")
  const [storage, setStorage] = useState("")
  const [problem, setProblem] = useState("")
  const [loading, setLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<DiagnosisStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pastDiagnoses, setPastDiagnoses] = useState<PastDiagnosis[]>([])
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<PastDiagnosis[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Get user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Fetch past diagnoses
  useEffect(() => {
    if (user) {
      fetchPastDiagnoses()
    }
  }, [user])

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

  const fetchPastDiagnoses = async () => {
    try {
      const { data, error } = await supabase
        .from("diagnoses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching past diagnoses:", error)
        return
      }

      setPastDiagnoses(data || [])
      setFilteredDiagnoses(data || [])
    } catch (err) {
      console.error("Error fetching past diagnoses:", err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleClearAll = () => {
    setCpu("")
    setGpu("")
    setRam("")
    setOs("")
    setStorage("")
    setProblem("")
    setDiagnosis(null)
    setError(null)
    setStatus("idle")
    setProgress(0)
  }

  const handleCopyDiagnosis = () => {
    if (!diagnosis) return
    
    const text = `
PC Doctor Diagnosis Report
==========================

Problem: ${problem}

Diagnosis: ${diagnosis.diagnosis}
Confidence: ${diagnosis.confidence}%

Possible Causes:
${diagnosis.possibleCauses.map((cause, i) => `${i + 1}. ${cause}`).join('\n')}

Solution Steps:
${diagnosis.steps.map((step, i) => `
Step ${step.step}: ${step.title}
Difficulty: ${step.difficulty}
Estimated Time: ${step.estimatedTime}
${step.description}
${step.commands ? `Commands:\n${step.commands.join('\n')}` : ''}
${step.warnings ? `Warnings:\n${step.warnings.join('\n')}` : ''}
`).join('\n')}

Preventive Tips:
${diagnosis.preventiveTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
    `.trim()
    
    navigator.clipboard.writeText(text)
  }

  const handleDownloadPDF = () => {
    if (!diagnosis) return
    
    // Create a simple text version for now (PDF generation would require a library)
    const text = `
PC Doctor Diagnosis Report
==========================

Problem: ${problem}

Diagnosis: ${diagnosis.diagnosis}
Confidence: ${diagnosis.confidence}%

Possible Causes:
${diagnosis.possibleCauses.map((cause, i) => `${i + 1}. ${cause}`).join('\n')}

Solution Steps:
${diagnosis.steps.map((step, i) => `
Step ${step.step}: ${step.title}
Difficulty: ${step.difficulty}
Estimated Time: ${step.estimatedTime}
${step.description}
${step.commands ? `Commands:\n${step.commands.join('\n')}` : ''}
${step.warnings ? `Warnings:\n${step.warnings.join('\n')}` : ''}
`).join('\n')}

Preventive Tips:
${diagnosis.preventiveTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
    `.trim()
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pc-doctor-diagnosis-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLoadPastDiagnosis = (pastDiagnosis: PastDiagnosis) => {
    setDiagnosis(pastDiagnosis.diagnosis_result)
    setProblem(pastDiagnosis.problem_description)
    setCpu(pastDiagnosis.system_specs.cpu)
    setGpu(pastDiagnosis.system_specs.gpu)
    setRam(pastDiagnosis.system_specs.ram)
    setOs(pastDiagnosis.system_specs.os)
    setStorage(pastDiagnosis.system_specs.storage)
  }

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDiagnosis(null)
    setStatus("analyzing")
    setProgress(25)

    try {
      // Simulate progress updates
      setTimeout(() => {
        setStatus("processing")
        setProgress(50)
      }, 1000)
      
      setTimeout(() => {
        setStatus("generating")
        setProgress(75)
      }, 2000)

      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemSpecs: {
            cpu: cpu || "Not specified",
            gpu: gpu || "Not specified",
            ram: ram || "Not specified",
            os: os || "Not specified",
            storage: storage || "Not specified",
          },
          problem,
        }),
      })

      // Complete the progress
      setStatus("completed")
      setProgress(100)

      if (!response.ok) {
        throw new Error("Failed to get diagnosis")
      }

      const data = await response.json()
      setDiagnosis(data)
      
      // Refresh past diagnoses after new diagnosis
      if (user) {
        fetchPastDiagnoses()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setStatus("error")
      setProgress(0)
    } finally {
      setLoading(false)
      // Reset progress after a delay
      setTimeout(() => {
        if (status !== "error") {
          setStatus("idle")
          setProgress(0)
        }
      }, 2000)
    }
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

  // Get status message based on current status
  const getStatusMessage = () => {
    switch (status) {
      case "analyzing":
        return "Analyzing your system specifications and problem description..."
      case "processing":
        return "Processing information with our AI engine..."
      case "generating":
        return "Generating personalized solutions and recommendations..."
      case "completed":
        return "Diagnosis complete! Here are your results."
      case "error":
        return "Something went wrong. Please try again."
      default:
        return ""
    }
  }

  // Get status icon based on current status
  const getStatusIcon = () => {
    switch (status) {
      case "analyzing":
        return <Zap className="h-5 w-5 text-primary" />
      case "processing":
        return <Clock className="h-5 w-5 text-primary" />
      case "generating":
        return <Sparkles className="h-5 w-5 text-primary" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const toggleHistoryPanel = () => {
    if (historyPanelOpen) {
      // Closing
      setIsTransitioning(true)
      setHistoryPanelOpen(false)
      // Keep panel visible during transition
      setTimeout(() => {
        setPanelVisible(false)
        setIsTransitioning(false)
      }, 300)
    } else {
      // Opening
      setPanelVisible(true)
      // Small delay to ensure DOM update before setting open state
      setTimeout(() => {
        setHistoryPanelOpen(true)
      }, 10)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <main className="relative z-10 container mx-auto px-4 py-8 animate-fade-in">
        {/* Welcome Section */}
        {user && (
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Welcome back!</h2>
            </div>
            <p className="text-muted-foreground">
              Signed in as <span className="text-foreground font-medium">{user.email}</span>
            </p>
          </div>
        )}

        <div className="flex">
          {/* History Panel - Fixed position sidebar */}
          {user && panelVisible && (
            <div className={`fixed left-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
              historyPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="h-full glass-card rounded-r-2xl border overflow-hidden shadow-xl mt-20">
                <div className="p-5 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                      <History className="h-5 w-5 text-primary" />
                      Diagnosis History
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleHistoryPanel}
                      className="p-1 h-8 w-8 rounded-full hover:bg-primary/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass rounded-full"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="overflow-y-auto h-[calc(100vh-220px)] pb-4">
                  {filteredDiagnoses.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <History className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <p className="text-sm">
                        {searchQuery ? "No matching diagnoses found" : "No diagnosis history yet"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 space-y-3">
                      {filteredDiagnoses.map((diagnosis) => (
                        <div 
                          key={diagnosis.id}
                          className="p-4 rounded-xl glass border cursor-pointer hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                          onClick={() => handleLoadPastDiagnosis(diagnosis)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                              {diagnosis.diagnosis_result.diagnosis}
                            </h4>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {diagnosis.diagnosis_result.confidence}%
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {diagnosis.problem_description}
                          </p>
                          
                          <div className="flex items-center text-xs text-muted-foreground mb-3">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(diagnosis.created_at)}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overlay for when panel is open */}
          {user && historyPanelOpen && (
            <div 
              className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
              onClick={toggleHistoryPanel}
            />
          )}

          {/* Main Content */}
          <div className={`w-full ${historyPanelOpen ? 'md:pl-80' : ''} transition-all duration-300 ease-in-out`}>
            <div className="flex items-start justify-center gap-8 relative">
              {/* Toggle History Button */}
              {user && (
                <div className="fixed left-4 top-24 z-30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleHistoryPanel}
                    className="glass-card rounded-full p-3 h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {historyPanelOpen ? (
                      <ChevronLeft className="h-5 w-5" />
                    ) : (
                      <History className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              )}

              {/* Input Section - Centered, slides left when diagnosis appears */}
              <div className={`space-y-6 transition-all duration-700 ${diagnosis ? 'lg:w-1/2' : 'lg:w-full max-w-3xl'}`}>
                <Card className="glass-card rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle>System Specifications</CardTitle>
                    <CardDescription>
                      Provide your system details (optional but helps with accuracy)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpu" className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        CPU / Processor
                      </Label>
                      <Input
                        id="cpu"
                        placeholder="e.g., Intel Core i7-10700K"
                        value={cpu}
                        onChange={(e) => setCpu(e.target.value)}
                        className="glass rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpu" className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        GPU / Graphics Card
                      </Label>
                      <Input
                        id="gpu"
                        placeholder="e.g., NVIDIA RTX 3070"
                        value={gpu}
                        onChange={(e) => setGpu(e.target.value)}
                        className="glass rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ram">RAM / Memory</Label>
                      <Input
                        id="ram"
                        placeholder="e.g., 16GB DDR4"
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        className="glass rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="os">Operating System</Label>
                      <Input
                        id="os"
                        placeholder="e.g., Windows 11, macOS Sonoma, Ubuntu 22.04"
                        value={os}
                        onChange={(e) => setOs(e.target.value)}
                        className="glass rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storage" className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        Storage
                      </Label>
                      <Input
                        id="storage"
                        placeholder="e.g., 512GB NVMe SSD"
                        value={storage}
                        onChange={(e) => setStorage(e.target.value)}
                        className="glass rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Describe Your Problem</CardTitle>
                    <CardDescription>
                      Be as detailed as possible about the issue you're experiencing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDiagnose} className="space-y-4">
                      <Textarea
                        placeholder="e.g., My computer is running very slow, takes 5 minutes to boot, and programs freeze frequently..."
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                        rows={6}
                        className="glass rounded-xl"
                      />
                      
                      {/* Progress indicator when loading */}
                      {loading && (
                        <div className="space-y-4 p-5 rounded-xl glass border">
                          <div className="flex items-center gap-3">
                            {getStatusIcon()}
                            <span className="text-sm font-medium">{getStatusMessage()}</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 rounded-full" />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Analyze</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Process</span>
                            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Generate</span>
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 rounded-xl py-6 text-base font-medium"
                          disabled={loading || !problem.trim()}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            "Diagnose Problem"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClearAll}
                          disabled={loading}
                          className="glass-card rounded-xl py-6 px-6"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Loading Skeleton */}
              {loading && !diagnosis && (
                <div className="lg:w-1/2 space-y-6 animate-in slide-in-from-right duration-700">
                  <Card className="glass-card rounded-2xl shadow-xl">
                    <CardHeader>
                      <Skeleton className="h-6 w-32 mb-2 rounded-xl" />
                      <Skeleton className="h-4 w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4 mt-2 rounded-xl" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40 rounded-xl" />
                        <Skeleton className="h-3 w-full rounded-xl" />
                        <Skeleton className="h-3 w-full rounded-xl" />
                        <Skeleton className="h-3 w-2/3 rounded-xl" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-xl" />
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Results Section - Slides in from right */}
              {diagnosis && (
                <div className="lg:w-1/2 space-y-6 animate-in slide-in-from-right duration-700">
                  <>
                    <Card className="glass-card rounded-2xl shadow-xl">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <CardTitle>Diagnosis</CardTitle>
                            <CardDescription className="mt-2">
                              {diagnosis.diagnosis}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleCopyDiagnosis}
                              className="glass-card rounded-xl"
                              title="Copy diagnosis"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleDownloadPDF}
                              className="glass-card rounded-xl"
                              title="Download as text file"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor("medium")} variant="outline">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-current"></div>
                            {diagnosis.confidence}% Confidence
                          </div>
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Possible Causes:</h4>
                          <ul className="space-y-1">
                            {diagnosis.possibleCauses.map((cause, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Confidence Level</span>
                            <span className="text-sm text-muted-foreground">{diagnosis.confidence}%</span>
                          </div>
                          <Progress value={diagnosis.confidence} className="h-2.5 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card rounded-2xl shadow-xl">
                      <CardHeader>
                        <CardTitle>Solution Steps</CardTitle>
                        <CardDescription>
                          Follow these steps carefully to resolve the issue
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {diagnosis.steps.map((step, index) => (
                          <div key={index} className="p-5 rounded-xl glass border">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                                  {step.step}
                                </div>
                                <h4 className="font-semibold">{step.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`${getDifficultyColor(step.difficulty)} rounded-full`}>
                                  {step.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs rounded-full">
                                  {step.estimatedTime}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {step.description}
                            </p>
                            {step.commands && step.commands.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <p className="text-xs font-medium">Commands:</p>
                                {step.commands.map((cmd, cmdIndex) => (
                                  <code key={cmdIndex} className="block p-3 rounded-lg bg-muted text-xs font-mono">
                                    {cmd}
                                  </code>
                                ))}
                              </div>
                            )}
                            {step.warnings && step.warnings.length > 0 && (
                              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Warning
                                </p>
                                {step.warnings.map((warning, warnIndex) => (
                                  <p key={warnIndex} className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                                    {warning}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {diagnosis.preventiveTips.length > 0 && (
                      <Card className="glass-card rounded-2xl shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Preventive Tips
                          </CardTitle>
                          <CardDescription>
                            Follow these tips to prevent future issues
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {diagnosis.preventiveTips.map((tip, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}