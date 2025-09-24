"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about your idea" },
  { id: 2, title: "Problem & Solution", description: "Define the problem and your solution" },
  { id: 3, title: "Market & Audience", description: "Identify your target market" },
  { id: 4, title: "Validation", description: "AI-powered analysis and validation" },
]

export default function NewIdeaPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isValidating, setIsValidating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem_statement: "",
    solution_approach: "",
    target_market: "",
  })
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleValidate = async () => {
    setIsValidating(true)
    const supabase = createClient()

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Simulate AI validation process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock validation score and data
      const validationScore = Math.floor(Math.random() * 40) + 60 // 60-100 range
      const validationData = {
        market_size: "$2.5B",
        competition_level: "Medium",
        demand_indicators: ["Growing search trends", "Active communities", "Existing solutions with gaps"],
        risk_factors: ["Market saturation", "High customer acquisition cost"],
        opportunities: ["Underserved niche", "Technology advancement", "Changing user behavior"],
        recommendations: [
          "Focus on specific user segment initially",
          "Validate with potential customers",
          "Consider MVP features carefully",
        ],
      }

      // Save to database
      const { data, error } = await supabase
        .from("startup_ideas")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          problem_statement: formData.problem_statement,
          solution_approach: formData.solution_approach,
          target_market: formData.target_market,
          validation_score: validationScore,
          validation_data: validationData,
          status: validationScore >= 70 ? "validated" : "validating",
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to the idea details page
      router.push(`/dashboard/ideas/${data.id}`)
    } catch (error) {
      console.error("Error validating idea:", error)
    } finally {
      setIsValidating(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Link href="/dashboard/ideas" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Validate New Idea</h1>
        </div>
        <p className="text-muted-foreground">
          Let our AI analyze your startup idea and provide comprehensive validation insights
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-accent" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-muted-foreground">{steps[currentStep - 1]?.title}</span>
          <span className="text-sm text-muted-foreground">
            {currentStep} of {steps.length}
          </span>
        </div>
      </div>

      {/* Form Steps */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">{steps[currentStep - 1]?.title}</CardTitle>
          <CardDescription className="text-muted-foreground">{steps[currentStep - 1]?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Idea Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., AI-powered fitness coach for busy professionals"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Brief Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your startup idea in 2-3 sentences..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="problem" className="text-foreground">
                  Problem Statement
                </Label>
                <Textarea
                  id="problem"
                  placeholder="What specific problem does your idea solve? Who experiences this problem?"
                  value={formData.problem_statement}
                  onChange={(e) => handleInputChange("problem_statement", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution" className="text-foreground">
                  Solution Approach
                </Label>
                <Textarea
                  id="solution"
                  placeholder="How does your idea solve this problem? What makes it unique?"
                  value={formData.solution_approach}
                  onChange={(e) => handleInputChange("solution_approach", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="target_market" className="text-foreground">
                  Target Market
                </Label>
                <Textarea
                  id="target_market"
                  placeholder="Who is your ideal customer? Demographics, behaviors, pain points..."
                  value={formData.target_market}
                  onChange={(e) => handleInputChange("target_market", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-medium text-foreground mb-2">💡 Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Be specific about your target market. Instead of "everyone," focus on a particular segment like
                  "working parents aged 25-40 in urban areas" or "small business owners with 5-50 employees."
                </p>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              {!isValidating ? (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Validate</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI will analyze your idea across multiple dimensions including market size, competition, demand
                    indicators, and provide actionable recommendations.
                  </p>
                  <Button onClick={handleValidate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Start AI Validation
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Validating Your Idea</h3>
                  <p className="text-muted-foreground mb-6">
                    Analyzing market data, competitor landscape, and demand signals...
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={66} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!formData.title || !formData.description)) ||
              (currentStep === 2 && (!formData.problem_statement || !formData.solution_approach)) ||
              (currentStep === 3 && !formData.target_market)
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
