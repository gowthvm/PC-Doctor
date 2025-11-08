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
import { Cpu, HardDrive, Monitor, Loader2, CheckCircle2, AlertCircle, Copy, Download, RotateCcw, Sparkles } from "lucide-react"

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

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDiagnosis(null)

    try {
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

      if (!response.ok) {
        throw new Error("Failed to get diagnosis")
      }

      const data = await response.json()
      setDiagnosis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
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

        <div className="flex items-start justify-center gap-8 transition-all duration-700">
          {/* Input Section - Centered, slides left when diagnosis appears */}
          <div className={`space-y-6 transition-all duration-700 ${diagnosis ? 'lg:w-1/2' : 'lg:w-full max-w-3xl'}`}>
            <Card className="glass-card">
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
                    className="glass"
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
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ram">RAM / Memory</Label>
                  <Input
                    id="ram"
                    placeholder="e.g., 16GB DDR4"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="glass"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Input
                    id="os"
                    placeholder="e.g., Windows 11, macOS Sonoma, Ubuntu 22.04"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="glass"
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
                    className="glass"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
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
                    className="glass"
                  />
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={loading || !problem.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                      className="glass-card"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Loading Skeleton */}
          {loading && !diagnosis && (
            <div className="lg:w-1/2 space-y-6 animate-in slide-in-from-right duration-700">
              <Card className="glass-card">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Section - Slides in from right */}
          {diagnosis && (
            <div className="lg:w-1/2 space-y-6 animate-in slide-in-from-right duration-700">
              <>
                <Card className="glass-card">
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
                          className="glass-card"
                          title="Copy diagnosis"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleDownloadPDF}
                          className="glass-card"
                          title="Download as text file"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor("medium")}>
                      {diagnosis.confidence}% Confidence
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Possible Causes:</h4>
                      <ul className="space-y-1">
                        {diagnosis.possibleCauses.map((cause, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Confidence Level</span>
                        <span className="text-sm text-muted-foreground">{diagnosis.confidence}%</span>
                      </div>
                      <Progress value={diagnosis.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Solution Steps</CardTitle>
                    <CardDescription>
                      Follow these steps carefully to resolve the issue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {diagnosis.steps.map((step, index) => (
                      <div key={index} className="p-4 rounded-lg glass border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                              {step.step}
                            </div>
                            <h4 className="font-semibold">{step.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                              {step.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {step.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        {step.commands && step.commands.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Commands:</p>
                            {step.commands.map((cmd, cmdIndex) => (
                              <code key={cmdIndex} className="block p-2 rounded bg-muted text-xs font-mono">
                                {cmd}
                              </code>
                            ))}
                          </div>
                        )}
                        {step.warnings && step.warnings.length > 0 && (
                          <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
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
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
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
                            <span className="text-primary mt-1">•</span>
                            {tip}
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
      </main>
    </div>
  )
}
