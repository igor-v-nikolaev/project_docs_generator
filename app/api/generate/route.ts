import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable." }, { status: 500 })
    }

    const body = await request.json()
    const { topic, context, tone, audience, requirements } = body

    // Validate required fields
    if (!topic || !context || !tone || !audience || !requirements) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create a comprehensive prompt from the form data
    const prompt = `
      Please generate content based on the following requirements:
      
      Topic: ${topic}
      Context: ${context}
      Tone: ${tone}
      Target Audience: ${audience}
      Special Requirements: ${requirements}
      
      Please create comprehensive, well-structured content that addresses all these aspects. The content should be engaging, informative, and tailored to the specified audience and tone.
    `

    const { text } = await generateText({
      model: google("gemini-1.5-flash", { apiKey }),
      prompt: prompt,
      maxTokens: 1000,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("=== API Route Error Details ===")
    console.error("Error type:", error?.constructor?.name)
    console.error("Error message:", error?.message)
    console.error("Full error:", error)
    console.error("Stack trace:", error?.stack)
    console.error("================================")

    return NextResponse.json(
      {
        error: "Failed to generate content. Please try again.",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 },
    )
  }
}
