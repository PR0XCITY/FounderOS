"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Code, Globe, Smartphone, Database, Loader2, CheckCircle, Lightbulb } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, title: "Project Setup", description: "Basic information about your MVP" },
  { id: 2, title: "Features", description: "Define core features and functionality" },
  { id: 3, title: "Tech Stack", description: "Choose your technology preferences" },
  { id: 4, title: "Generation", description: "AI builds your MVP" },
]

const techStackOptions = [
  { id: "nextjs", name: "Next.js", description: "React framework for web apps", icon: Globe },
  { id: "react-native", name: "React Native", description: "Cross-platform mobile apps", icon: Smartphone },
  { id: "api", name: "REST API", description: "Backend API service", icon: Database },
  { id: "database", name: "Database", description: "Data storage and management", icon: Database },
]

const commonFeatures = [
  "User Authentication",
  "User Profiles",
  "Dashboard",
  "Search Functionality",
  "Notifications",
  "Payment Integration",
  "File Upload",
  "Real-time Updates",
  "Admin Panel",
  "Analytics",
  "Email Integration",
  "Social Login",
]

export default function NewMVPPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkedIdea, setLinkedIdea] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: [] as string[],
    tech_stack: [] as string[],
    custom_requirements: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const ideaId = searchParams.get("ideaId")

  useEffect(() => {
    if (ideaId) {
      fetchLinkedIdea(ideaId)
    }
  }, [ideaId])

  const fetchLinkedIdea = async (id: string) => {
    const supabase = createClient()
    const { data } = await supabase.from("startup_ideas").select("*").eq("id", id).single()
    if (data) {
      setLinkedIdea(data)
      setFormData((prev) => ({
        ...prev,
        name: `${data.title} MVP`,
        description: `MVP for ${data.title}: ${data.description}`,
      }))
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleTechStackToggle = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.includes(tech)
        ? prev.tech_stack.filter((t) => t !== tech)
        : [...prev.tech_stack, tech],
    }))
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

      // Simulate MVP generation process
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Generate mock wireframes and code structure
      const wireframes = [
        { name: "Landing Page", url: "/landing-page-wireframe.jpg" },
        { name: "Dashboard", url: "/dashboard-wireframe.png" },
        { name: "User Profile", url: "/user-profile-wireframe.jpg" },
      ]

      const generatedCode = `// Generated MVP Structure
// This is a simplified representation of your generated MVP

// Main App Component
function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path="/" component={LandingPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={UserProfile} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

// Features implemented:
${formData.features.map((feature) => `// - ${feature}`).join("\n")}

// Tech Stack:
${formData.tech_stack.map((tech) => `// - ${tech}`).join("\n")}
`

      // Save to database
      const { data, error } = await supabase
        .from("mvp_projects")
        .insert({
          user_id: user.id,
          idea_id: ideaId || null,
          name: formData.name,
          description: formData.description,
          tech_stack: formData.tech_stack,
          features: formData.features,
          wireframes: wireframes,
          generated_code: generatedCode,
          status: "completed",
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to the MVP details page
      router.push(`/dashboard/mvp/${data.id}`)
    } catch (error) {
      console.error("Error generating MVP:", error)
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
          <Link href="/dashboard/mvp" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Build New MVP</h1>
        </div>
        {linkedIdea && (
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">
              Building MVP for: <span className="text-foreground font-medium">{linkedIdea.title}</span>
            </span>
          </div>
        )}
        <p className="text-muted-foreground">
          Create a functional prototype of your idea with AI-powered no-code tools
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
                <Label htmlFor="name" className="text-foreground">
                  MVP Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., FitTracker MVP, TaskManager Pro"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your MVP will do and who it's for..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px]"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground text-base font-medium">Core Features</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the essential features for your MVP. Start with 3-5 core features.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm text-foreground cursor-pointer">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom_requirements" className="text-foreground">
                    Custom Requirements
                  </Label>
                  <Textarea
                    id="custom_requirements"
                    placeholder="Any specific features or requirements not listed above..."
                    value={formData.custom_requirements}
                    onChange={(e) => handleInputChange("custom_requirements", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground text-base font-medium">Technology Stack</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the technologies you'd like to use for your MVP.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {techStackOptions.map((tech) => (
                    <div
                      key={tech.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        formData.tech_stack.includes(tech.id)
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => handleTechStackToggle(tech.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <tech.icon className="h-5 w-5 text-accent" />
                        <div>
                          <h4 className="font-medium text-foreground">{tech.name}</h4>
                          <p className="text-sm text-muted-foreground">{tech.description}</p>
                        </div>
                        {formData.tech_stack.includes(tech.id) && (
                          <CheckCircle className="h-5 w-5 text-accent ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              {!isGenerating ? (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI will create wireframes, generate code, and build your MVP based on your specifications.
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm text-foreground">Features</span>
                      <Badge variant="outline">{formData.features.length} selected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm text-foreground">Tech Stack</span>
                      <Badge variant="outline">{formData.tech_stack.length} technologies</Badge>
                    </div>
                  </div>
                  <Button onClick={handleGenerate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Generate MVP
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Generating Your MVP</h3>
                  <p className="text-muted-foreground mb-6">
                    Creating wireframes, generating code, and setting up your project structure...
                  </p>
                  <div className="max-w-md mx-auto">
                    <Progress value={75} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">This may take a few minutes</p>
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
              (currentStep === 1 && (!formData.name || !formData.description)) ||
              (currentStep === 2 && formData.features.length === 0) ||
              (currentStep === 3 && formData.tech_stack.length === 0)
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
