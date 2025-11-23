"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Zap,
  HardDrive,
  Package,
  Wifi,
  Monitor,
  Volume2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

interface DiagnosticWizardProps {
  onComplete: (description: string) => void
  onCancel: () => void
}

type ProblemCategory =
  | "performance"
  | "hardware"
  | "software"
  | "network"
  | "display"
  | "audio"
  | "other"

interface CategoryInfo {
  id: ProblemCategory
  name: string
  icon: React.ReactNode
  description: string
  symptoms: string[]
}

const categories: CategoryInfo[] = [
  {
    id: "performance",
    name: "Performance Issues",
    icon: <Zap className="h-6 w-6" />,
    description: "Slow computer, freezing, crashes",
    symptoms: [
      "Computer is slow or laggy",
      "Long boot time (takes forever to start)",
      "Programs freeze or become unresponsive",
      "High CPU or RAM usage",
      "Disk usage constantly at 100%",
      "System overheating or fans running loud"
    ]
  },
  {
    id: "hardware",
    name: "Hardware Issues",
    icon: <HardDrive className="h-6 w-6" />,
    description: "Physical components not working",
    symptoms: [
      "Device not recognized or detected",
      "USB ports not working",
      "Keyboard or mouse issues",
      "Battery draining very fast",
      "Strange noises (clicking, grinding, buzzing)",
      "Computer won't turn on or power issues"
    ]
  },
  {
    id: "software",
    name: "Software Issues",
    icon: <Package className="h-6 w-6" />,
    description: "Programs, apps, or OS problems",
    symptoms: [
      "Application won't start or open",
      "Error messages on startup",
      "Blue Screen of Death (BSOD) or system crashes",
      "Programs crashing frequently",
      "Can't install or uninstall software",
      "System updates failing or stuck"
    ]
  },
  {
    id: "network",
    name: "Network Issues",
    icon: <Wifi className="h-6 w-6" />,
    description: "Internet and connectivity problems",
    symptoms: [
      "No internet connection",
      "WiFi keeps disconnecting",
      "Very slow internet speed",
      "Can't connect to network",
      "Ethernet cable not working",
      "VPN or remote connection issues"
    ]
  },
  {
    id: "display",
    name: "Display Issues",
    icon: <Monitor className="h-6 w-6" />,
    description: "Screen and graphics problems",
    symptoms: [
      "Screen flickering or flashing",
      "No display output (black screen)",
      "Wrong resolution or blurry display",
      "Color problems or distortion",
      "Multiple monitor issues",
      "Screen artifacts, lines, or glitches"
    ]
  },
  {
    id: "audio",
    name: "Audio Issues",
    icon: <Volume2 className="h-6 w-6" />,
    description: "Sound and microphone problems",
    symptoms: [
      "No sound output from speakers",
      "Microphone not working or detected",
      "Audio crackling, popping, or distortion",
      "Wrong audio device selected",
      "Volume control not working",
      "Bluetooth audio connection issues"
    ]
  },
  {
    id: "other",
    name: "Other Issues",
    icon: <HelpCircle className="h-6 w-6" />,
    description: "Something else or not sure",
    symptoms: [
      "Security or virus concerns",
      "Data recovery or backup issues",
      "Printer or peripheral problems",
      "Email or account access issues",
      "File or folder problems",
      "Other (I'll describe it myself)"
    ]
  }
]

const timelineOptions = [
  { value: "just-now", label: "Just now" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "longer", label: "Longer ago" }
]

const frequencyOptions = [
  { value: "constantly", label: "Constantly (all the time)" },
  { value: "frequently", label: "Frequently (multiple times per day)" },
  { value: "occasionally", label: "Occasionally (few times per week)" },
  { value: "rarely", label: "Rarely (once in a while)" }
]

const triggerOptions = [
  { value: "os-update", label: "Windows/OS update" },
  { value: "software-install", label: "Software installation" },
  { value: "hardware-change", label: "Hardware change or upgrade" },
  { value: "system-crash", label: "System crash or freeze" },
  { value: "power-outage", label: "Power outage or sudden shutdown" },
  { value: "nothing", label: "Nothing specific I can think of" }
]

export default function DiagnosticWizard({ onComplete, onCancel }: DiagnosticWizardProps) {
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState<ProblemCategory | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [timeline, setTimeline] = useState("")
  const [frequency, setFrequency] = useState("")
  const [trigger, setTrigger] = useState("")
  const [recentChanges, setRecentChanges] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const generateDescription = () => {
    const categoryInfo = categories.find(c => c.id === category)

    let description = `Problem Category: ${categoryInfo?.name || "Not specified"}\n\n`

    if (selectedSymptoms.length > 0) {
      description += "Symptoms:\n"
      selectedSymptoms.forEach(symptom => {
        description += `- ${symptom}\n`
      })
      description += "\n"
    }

    description += "Timeline:\n"
    const timelineLabel = timelineOptions.find(t => t.value === timeline)?.label || "Not specified"
    const frequencyLabel = frequencyOptions.find(f => f.value === frequency)?.label || "Not specified"
    const triggerLabel = triggerOptions.find(t => t.value === trigger)?.label || "Not specified"

    description += `Started: ${timelineLabel}\n`
    description += `Frequency: ${frequencyLabel}\n`
    description += `Triggered by: ${triggerLabel}\n\n`

    if (recentChanges.trim()) {
      description += `Recent Changes:\n${recentChanges}\n\n`
    }

    if (additionalDetails.trim()) {
      description += `Additional Details:\n${additionalDetails}`
    }

    return description.trim()
  }

  const handleComplete = () => {
    const description = generateDescription()
    onComplete(description)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return category !== null
      case 2:
        return selectedSymptoms.length > 0
      case 3:
        return timeline !== "" && frequency !== ""
      case 4:
        return trigger !== ""
      case 5:
        return true
      default:
        return false
    }
  }

  const currentCategory = categories.find(c => c.id === category)

  return (
    <Card className="glass-card-premium rounded-2xl shadow-xl border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary icon-hover" />
              Diagnostic Wizard
            </CardTitle>
            <CardDescription>
              Answer a few questions to help us understand your problem better
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            Step {step} of {totalSteps}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">What type of problem are you experiencing?</h3>
              <p className="text-sm text-muted-foreground">Select the category that best matches your issue</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.98] ${category === cat.id
                    ? "border-primary bg-primary/10"
                    : "border-border glass hover:border-primary/50 hover:shadow-md"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${category === cat.id ? "bg-primary/20 text-primary" : "bg-muted"
                      }`}>
                      {cat.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                    {category === cat.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Symptom Selection */}
        {step === 2 && currentCategory && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Which symptoms are you experiencing?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
            </div>
            <div className="space-y-3">
              {currentCategory.symptoms.map((symptom, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-primary/5 ${selectedSymptoms.includes(symptom)
                    ? "border-primary bg-primary/10"
                    : "border-border glass"
                    }`}
                  onClick={() => handleSymptomToggle(symptom)}
                >
                  <Checkbox
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                    className="mt-0.5"
                  />
                  <Label className="flex-1 cursor-pointer text-sm leading-relaxed">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Timeline */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary icon-hover" />
                  When did this problem start?
                </h3>
                <p className="text-sm text-muted-foreground">This helps us understand if it's a recent issue</p>
              </div>
              <div className="space-y-2">
                {timelineOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeline(option.value)}
                    className={`w-full p-3 rounded-xl border transition-all duration-200 text-left hover:bg-primary/5 ${timeline === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border glass"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{option.label}</span>
                      {timeline === option.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary icon-hover" />
                  How often does this happen?
                </h3>
                <p className="text-sm text-muted-foreground">Frequency helps determine severity</p>
              </div>
              <div className="space-y-2">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFrequency(option.value)}
                    className={`w-full p-3 rounded-xl border transition-all duration-200 text-left hover:bg-primary/5 ${frequency === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border glass"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{option.label}</span>
                      {frequency === option.value && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Trigger Event */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary icon-hover" />
                Did this start after any specific event?
              </h3>
              <p className="text-sm text-muted-foreground">Knowing what triggered it helps identify the cause</p>
            </div>
            <div className="space-y-2">
              {triggerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTrigger(option.value)}
                  className={`w-full p-3 rounded-xl border transition-all duration-200 text-left hover:bg-primary/5 ${trigger === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border glass"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option.label}</span>
                    {trigger === option.value && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="recent-changes">Any recent changes to your system? (Optional)</Label>
              <Textarea
                id="recent-changes"
                placeholder="e.g., Installed new graphics drivers, added more RAM, changed antivirus software..."
                value={recentChanges}
                onChange={(e) => setRecentChanges(e.target.value)}
                rows={3}
                className="glass rounded-xl input-glow"
              />
            </div>
          </div>
        )}

        {/* Step 5: Review and Additional Details */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Review and Add Details</h3>
              <p className="text-sm text-muted-foreground">Here's what we've gathered so far</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl glass border">
                <h4 className="font-semibold mb-2 text-sm">Problem Category</h4>
                <p className="text-sm text-muted-foreground">{currentCategory?.name}</p>
              </div>

              <div className="p-4 rounded-xl glass border">
                <h4 className="font-semibold mb-2 text-sm">Selected Symptoms ({selectedSymptoms.length})</h4>
                <ul className="space-y-1">
                  {selectedSymptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl glass border">
                <h4 className="font-semibold mb-2 text-sm">Timeline</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Started: {timelineOptions.find(t => t.value === timeline)?.label}</p>
                  <p>Frequency: {frequencyOptions.find(f => f.value === frequency)?.label}</p>
                  <p>Triggered by: {triggerOptions.find(t => t.value === trigger)?.label}</p>
                </div>
              </div>

              {recentChanges && (
                <div className="p-4 rounded-xl glass border">
                  <h4 className="font-semibold mb-2 text-sm">Recent Changes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{recentChanges}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <Label htmlFor="additional-details">Anything else we should know? (Optional)</Label>
              <Textarea
                id="additional-details"
                placeholder="Add any other relevant details, error messages, or context that might help..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={4}
                className="glass rounded-xl input-glow"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="glass-card rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onCancel}
            className="glass-card rounded-xl"
          >
            Cancel
          </Button>

          <div className="flex-1" />

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="rounded-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Diagnosis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
