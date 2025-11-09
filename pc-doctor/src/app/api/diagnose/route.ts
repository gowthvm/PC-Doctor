import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface SystemSpecs {
  cpu: string
  gpu: string
  ram: string
  os: string
  storage: string
}

interface OSCommands {
  windows?: string[]
  macos?: string[]
  linux?: string[]
}

interface DiagnosisRequest {
  systemSpecs: SystemSpecs
  problem: string
}

// Function to get available API keys from environment variables
function getAvailableApiKeys(): string[] {
  const keys: string[] = []
  const keyEnvVars = [
    process.env.OPENROUTER_API_KEY,
    process.env.OPENROUTER_API_KEY_2,
    process.env.OPENROUTER_API_KEY_3
  ]
  
  // Filter out undefined or empty keys
  keyEnvVars.forEach(key => {
    if (key && key.trim() !== '') {
      keys.push(key.trim())
    }
  })
  
  return keys
}

// Function to make API call with a specific key
async function callOpenRouterWithKey(apiKey: string, prompt: string) {
  return await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "PC Doctor",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are PC Doctor, an expert computer technician. Provide detailed, accurate technical diagnoses and solutions. Always respond with valid JSON only, no additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: DiagnosisRequest = await request.json()
    const { systemSpecs, problem } = body

    if (!problem || problem.trim().length === 0) {
      return NextResponse.json(
        { error: "Problem description is required" },
        { status: 400 }
      )
    }

    // Construct the prompt for OpenRouter
    const prompt = `You are PC Doctor, an expert computer technician and hardware specialist with 20+ years of experience. Your role is to provide accurate, detailed technical diagnoses based on the user's specific system configuration and problem description.

IMPORTANT INSTRUCTIONS:
1. ANALYZE THE SYSTEM SPECIFICATIONS CAREFULLY - Consider CPU architecture, RAM capacity, OS version, GPU capabilities, and storage type when diagnosing.
2. TAILOR YOUR SOLUTION to the specific hardware and software environment provided.
3. If the user has older/lower-spec hardware, acknowledge limitations and provide realistic solutions.
4. For OS-specific issues, provide commands and solutions that work on that exact operating system.
5. Set confidence score based on:
   - 90-100%: Clear symptoms matching known issues with the exact hardware/software
   - 70-89%: Probable cause based on common patterns for similar systems
   - 50-69%: Multiple possible causes, need more info
   - Below 50%: Insufficient information or very rare issue
6. Include OS-SPECIFIC commands for each step. Format commands as an object with keys for different operating systems:
   - "commands": {
       "windows": ["PowerShell or CMD commands for Windows"],
       "macos": ["Terminal commands for macOS"],
       "linux": ["Bash commands for Linux"]
     }
   - Only include keys for operating systems where the command applies
   - If a command is universal (works on all OS), put it in all three keys
   - Provide the EXACT commands for each OS - don't use placeholders
7. Warn about hardware compatibility issues if specs are insufficient for certain solutions
8. For performance issues, reference whether the user's RAM/CPU/GPU meets typical requirements
9. Prioritize solutions that don't require additional hardware purchases unless absolutely necessary
10. Be precise about whether a solution is temporary workaround vs permanent fix
11. For troubleshooting steps, provide clear, actionable instructions that users can follow.

System Specifications:
- CPU: ${systemSpecs.cpu || "Not specified"}
- GPU: ${systemSpecs.gpu || "Not specified"}
- RAM: ${systemSpecs.ram || "Not specified"}
- Operating System: ${systemSpecs.os || "Not specified"}
- Storage: ${systemSpecs.storage || "Not specified"}

Problem Description:
${problem}

Provide your response in the following JSON format:
{
  "diagnosis": "Clear, specific summary of the issue considering the user's hardware/software",
  "confidence": 85,
  "possibleCauses": ["Specific cause 1 related to their system", "Specific cause 2", "Specific cause 3"],
  "steps": [
    {
      "step": 1,
      "title": "Clear action title",
      "description": "Detailed step-by-step instructions tailored to their OS and hardware. Explain WHY this step helps.",
      "difficulty": "easy|medium|hard",
      "estimatedTime": "5-10 mins",
      "commands": {
        "windows": ["Get-Process | Sort-Object CPU -Descending | Select-Object -First 10"],
        "macos": ["top -o cpu -n 10"],
        "linux": ["top -bn1 | head -20"]
      },
      "warnings": ["Important: any risks or prerequisites specific to their system"]
    }
  ],
  "preventiveTips": ["Actionable prevention tip 1 for their system", "Tip 2", "Tip 3"]
}

Provide 3-6 solution steps ordered from quickest/easiest to most involved. If system specs are missing, note when you need that info to provide better guidance. Return ONLY valid JSON, no markdown or additional text.`

    // Get available API keys
    const apiKeys = getAvailableApiKeys()
    
    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "No OpenRouter API keys configured" },
        { status: 500 }
      )
    }

    // Try each API key until one works or all fail
    let openRouterResponse: Response | null = null
    let lastError: any = null
    
    for (const apiKey of apiKeys) {
      try {
        openRouterResponse = await callOpenRouterWithKey(apiKey, prompt)
        
        // If the response is successful, break the loop
        if (openRouterResponse.ok) {
          break
        } else {
          // If not successful, store the error and try the next key
          const errorData = await openRouterResponse.json()
          console.error(`OpenRouter API error with key ${apiKey.substring(0, 10)}...:`, errorData)
          lastError = errorData
        }
      } catch (error) {
        console.error(`Network error with key ${apiKey.substring(0, 10)}...:`, error)
        lastError = error
      }
    }

    // If all keys failed
    if (!openRouterResponse || !openRouterResponse.ok) {
      console.error("All OpenRouter API keys failed:", lastError)
      return NextResponse.json(
        { error: "Failed to get diagnosis from AI service - all API keys exhausted" },
        { status: 500 }
      )
    }

    const openRouterData = await openRouterResponse.json()
    const aiResponse = openRouterData.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI service" },
        { status: 500 }
      )
    }

    // Parse the AI response
    let diagnosis
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0])
      } else {
        diagnosis = JSON.parse(aiResponse)
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("AI Response:", aiResponse)
      
      // Fallback response if parsing fails
      diagnosis = {
        diagnosis: "Unable to parse AI response. Please try again.",
        confidence: 50,
        possibleCauses: ["AI response parsing error"],
        steps: [
          {
            step: 1,
            title: "Try Again",
            description: "Please rephrase your problem and try again.",
            difficulty: "easy",
            estimatedTime: "1 min",
          },
        ],
        preventiveTips: ["Provide more specific details about your issue"],
      }
    }

    // Store diagnosis in database for future reference
    await supabase.from("diagnoses").insert({
      user_id: user.id,
      system_specs: systemSpecs,
      problem_description: problem,
      diagnosis_result: diagnosis,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error("Diagnosis error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}