"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface FormData {
  topic: string
  context: string
  tone: string
  audience: string
  requirements: string
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    context: "",
    tone: "",
    audience: "",
    requirements: "",
  })
  const [response, setResponse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse("")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await res.json()
      setResponse(data.text)
    } catch (err) {
      console.error("Client-side error:", err)

      // Try to get more details from the response
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Content Generator</h1>
          <p className="text-lg text-gray-600">Fill out the form below to generate content using Google Gemini AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Content Requirements</CardTitle>
              <CardDescription>Provide details about the content you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="What is the main topic or subject?"
                    value={formData.topic}
                    onChange={(e) => handleInputChange("topic", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Input
                    id="context"
                    placeholder="Provide background context or setting"
                    value={formData.context}
                    onChange={(e) => handleInputChange("context", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Input
                    id="tone"
                    placeholder="What tone should the content have? (e.g., professional, casual, friendly)"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="Who is the intended audience?"
                    value={formData.audience}
                    onChange={(e) => handleInputChange("audience", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Input
                    id="requirements"
                    placeholder="Any specific requirements or constraints?"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>AI-generated content will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Generating content...</span>
                </div>
              )}

              {response && !isLoading && (
                <div className="bg-gray-50 rounded-md p-4">
                  <Textarea value={response} readOnly className="min-h-[300px] bg-white border-gray-200 resize-none" />
                </div>
              )}

              {!response && !isLoading && !error && (
                <div className="text-center py-8 text-gray-500">
                  <p>Fill out the form and click "Generate Content" to see AI-generated text here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
