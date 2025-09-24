"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, FileText, Loader2, Lightbulb, Target, DollarSign, Users } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, title: "Basic Info", description: "Pitch deck overview and goals" },
  { id: 2, title: "Business Model", description: "Revenue and market strategy" },
  { id: 3, title: "Team & Traction", description: "Team members and achievements" },
  { id: 4, title: "Generation", description: "AI creates your pitch deck" },
]

const pitchTypes = [
  { value: "seed", label: "Seed Funding", description: "Early-stage funding for product development" },
  { value: "series-a", label: "Series A", description: "Growth funding for scaling operations" },
  { value: "series-b", label: "Series B", description: "Expansion funding for market leadership" },
  { value: "demo-day", label: "Demo Day", description: "Accelerator or competition presentation" },
]

export default function NewPitchDeckPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkedIdea, setLinkedIdea] = useState<any>(null)
  const [linkedMVP, setLinkedMVP] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pitch_type: "",
    funding_goal: "",
    business_model: "",
    target_market: "",
    team_info: "",
    traction_metrics: "",
    competitive_advantage: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const ideaId = searchParams.get("ideaId")
  const mvpId = searchParams.get("mvpId")

  useEffect(() => {
    if (ideaId) {
      fetchLinkedIdea(ideaId)
    }
    if (mvpId) {
      fetchLinkedMVP(mvpId)
    }
  }, [ideaId, mvpId])

  const fetchLinkedIdea = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase.from("startup_ideas").select("*").eq("id", id).single()
    if (data) {
      setLinkedIdea(data)
      setFormData((prev) => ({
        ...prev,
        title: `${data.title} Pitch Deck`,
        description: data.description,
        target_market: data.target_market || "",
      }))
    }
  }

  const fetchLinkedMVP = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase.from("mvp_projects").select("*").eq("id", id).single()
    if (data) {
      setLinkedMVP(data)
      setFormData((prev) => ({
        ...prev,
        title: `${data.name} Pitch Deck`,
        description: data.description,
      }))
    }
  }

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

  const handleGenerate = async () => {
    setIsGenerating(true)
    const supabase = createClient()

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Simulate pitch deck generation process
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // Generate mock slides
      const slides = generateSlides(formData, linkedIdea, linkedMVP)

      // Save to database
      const { data, error } = await supabase
        .from("pitch_decks")
        .insert({
          user_id: user.id,
          idea_id: ideaId || null,
          mvp_id: mvpId || null,
          title: formData.title,
          description: formData.description,
          pitch_type: formData.pitch_type,
          slides: slides,
          status: "completed",
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to the pitch deck details page
      router.push(`/dashboard/pitch/${data.id}`)
    } catch (error) {
      console.error("Error generating pitch deck:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Link href="/dashboard/pitch" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create Pitch Deck</h1>
        </div>
        {(linkedIdea || linkedMVP) && (
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Creating pitch deck for:{" "}
              <span className="text-foreground font-medium">{linkedIdea?.title || linkedMVP?.name}</span>
            </span>
          </div>
        )}
        <p className="text-muted-foreground">Build investor-ready presentations with AI-powered content generation</p>
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
                  Pitch Deck Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., FitTracker - Revolutionizing Personal Fitness"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of your company and what it does..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pitch_type" className="text-foreground">
                  Pitch Type
                </Label>
                <Select value={formData.pitch_type} onValueChange={(value) => handleInputChange("pitch_type", value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select pitch type" />
                  </SelectTrigger>
                  <SelectContent>
                    {pitchTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="funding_goal" className="text-foreground">
                  Funding Goal
                </Label>
                <Input
                  id="funding_goal"
                  placeholder="e.g., $500K, $2M, $10M"
                  value={formData.funding_goal}
                  onChange={(e) => handleInputChange("funding_goal", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_model" className="text-foreground">
                  Business Model
                </Label>
                <Textarea
                  id="business_model"
                  placeholder="How do you make money? Revenue streams, pricing strategy..."
                  value={formData.business_model}
                  onChange={(e) => handleInputChange("business_model", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitive_advantage" className="text-foreground">
                  Competitive Advantage
                </Label>
                <Textarea
                  id="competitive_advantage"
                  placeholder="What makes you different from competitors? Your unique value proposition..."
                  value={formData.competitive_advantage}
                  onChange={(e) => handleInputChange("competitive_advantage", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="team_info" className="text-foreground">
                  Team Information
                </Label>
                <Textarea
                  id="team_info"
                  placeholder="Key team members, their roles, and relevant experience..."
                  value={formData.team_info}
                  onChange={(e) => handleInputChange("team_info", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traction_metrics" className="text-foreground">
                  Traction & Metrics
                </Label>
                <Textarea
                  id="traction_metrics"
                  placeholder="Key achievements, user growth, revenue, partnerships, awards..."
                  value={formData.traction_metrics}
                  onChange={(e) => handleInputChange("traction_metrics", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <h4 className="font-medium text-foreground mb-2">💡 Tip</h4>
                <p className="text-sm text-muted-foreground">
                  Include specific numbers and metrics where possible. Investors love concrete data that shows growth
                  and validation.
                </p>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              {!isGenerating ? (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI will create a professional pitch deck with compelling content, visuals, and investor-focused
                    messaging.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Problem & Solution</p>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <DollarSign className="h-6 w-6 text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Business Model</p>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <Users className="h-6 w-6 text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">Team & Traction</p>
                    </div>
                  </div>
                  <Button onClick={handleGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Generate Pitch Deck
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Creating Your Pitch Deck</h3>
                  <p className="text-muted-foreground mb-6">
                    Generating slides, crafting compelling content, and designing professional layouts...
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={80} className="h-2" />
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
              (currentStep === 1 && (!formData.title || !formData.description || !formData.pitch_type)) ||
              (currentStep === 2 && (!formData.funding_goal || !formData.business_model)) ||
              (currentStep === 3 && (!formData.team_info || !formData.traction_metrics))
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

// Helper function to generate mock slides
function generateSlides(formData: any, linkedIdea: any, linkedMVP: any) {
  return [
    {
      title: "Title Slide",
      content: {
        title: formData.title,
        subtitle: formData.description,
        presenter: "Founder & CEO",
      },
    },
    {
      title: "Problem",
      content: {
        title: "The Problem",
        description: linkedIdea?.problem_statement || "Market problem description",
        statistics: ["85% of target market experiences this issue", "Current solutions are inadequate"],
      },
    },
    {
      title: "Solution",
      content: {
        title: "Our Solution",
        description: linkedIdea?.solution_approach || formData.description,
        features: linkedMVP?.features || ["Key feature 1", "Key feature 2", "Key feature 3"],
      },
    },
    {
      title: "Market Opportunity",
      content: {
        title: "Market Opportunity",
        market_size: "$2.5B TAM",
        target_market: formData.target_market || linkedIdea?.target_market,
        growth_rate: "15% CAGR",
      },
    },
    {
      title: "Business Model",
      content: {
        title: "Business Model",
        description: formData.business_model,
        revenue_streams: ["Primary revenue stream", "Secondary revenue stream"],
      },
    },
    {
      title: "Traction",
      content: {
        title: "Traction & Metrics",
        metrics: formData.traction_metrics.split("\n").filter(Boolean),
        achievements: ["Key milestone 1", "Key milestone 2"],
      },
    },
    {
      title: "Team",
      content: {
        title: "Our Team",
        description: formData.team_info,
        advisors: ["Industry expert", "Technical advisor"],
      },
    },
    {
      title: "Funding",
      content: {
        title: "Funding Request",
        amount: formData.funding_goal,
        use_of_funds: ["Product development 40%", "Marketing 30%", "Team expansion 20%", "Operations 10%"],
      },
    },
  ]
}
