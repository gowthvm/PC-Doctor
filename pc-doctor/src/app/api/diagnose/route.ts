import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface SystemSpecs {
  cpu: string
  gpu: string
  ram: string
  os: string
  storage: string
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
    const prompt = `You are PC Doctor, an expert computer technician AI assistant. Analyze the following computer problem and provide a detailed diagnosis with step-by-step solutions.

System Specifications:
- CPU: ${systemSpecs.cpu}
- GPU: ${systemSpecs.gpu}
- RAM: ${systemSpecs.ram}
- Operating System: ${systemSpecs.os}
- Storage: ${systemSpecs.storage}

Problem Description:
${problem}

Please provide your response in the following JSON format:
{
  "diagnosis": "Brief summary of the main issue",
  "confidence": 85,
  "possibleCauses": ["Cause 1", "Cause 2", "Cause 3"],
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed description of what to do",
      "difficulty": "easy|medium|hard",
      "estimatedTime": "5 mins",
      "commands": ["command1", "command2"],
      "warnings": ["Warning if any"]
    }
  ],
  "preventiveTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Provide 3-5 solution steps that are clear, actionable, and appropriate for the user's system. Include specific commands when applicable. Make sure the confidence score reflects how certain you are about the diagnosis based on the information provided.`

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