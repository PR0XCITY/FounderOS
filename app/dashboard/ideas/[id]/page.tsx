import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  DollarSign,
  Target,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get the specific idea
  const { data: idea, error: ideaError } = await supabase
    .from("startup_ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (ideaError || !idea) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "validating":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "validated":
        return "Validated"
      case "validating":
        return "Needs More Work"
      case "rejected":
        return "High Risk"
      default:
        return "Draft"
    }
  }

  const validationData = (idea.validation_data as any) || {}

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/ideas" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{idea.title}</h1>
            <p className="text-muted-foreground mt-1">Created on {new Date(idea.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(idea.status)}>{getStatusText(idea.status)}</Badge>
          {idea.status === "validated" && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href={`/dashboard/mvp/new?ideaId=${idea.id}`}>
                Build MVP <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Validation Score */}
      {idea.validation_score > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span>Validation Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Overall Score</span>
                  <span className="text-2xl font-bold text-foreground">{idea.validation_score}/100</span>
                </div>
                <Progress value={idea.validation_score} className="h-3" />
              </div>
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    idea.validation_score >= 80
                      ? "bg-green-500/10"
                      : idea.validation_score >= 60
                        ? "bg-yellow-500/10"
                        : "bg-red-500/10"
                  }`}
                >
                  {idea.validation_score >= 80 ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : idea.validation_score >= 60 ? (
                    <Lightbulb className="h-8 w-8 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {idea.validation_score >= 80 ? "Strong" : idea.validation_score >= 60 ? "Promising" : "Risky"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Idea Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Idea Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Idea Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground">{idea.description}</p>
              </div>

              {idea.problem_statement && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Problem Statement</h4>
                  <p className="text-muted-foreground">{idea.problem_statement}</p>
                </div>
              )}

              {idea.solution_approach && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Solution Approach</h4>
                  <p className="text-muted-foreground">{idea.solution_approach}</p>
                </div>
              )}

              {idea.target_market && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Target Market</h4>
                  <p className="text-muted-foreground">{idea.target_market}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Analysis */}
          {validationData.market_size && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  <span>Market Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <h4 className="font-medium text-foreground mb-1">Market Size</h4>
                    <p className="text-2xl font-bold text-accent">{validationData.market_size}</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Competition Level</h4>
                    <p className="text-lg font-semibold text-foreground">{validationData.competition_level}</p>
                  </div>
                </div>

                {validationData.demand_indicators && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Demand Indicators</h4>
                    <ul className="space-y-1">
                      {validationData.demand_indicators.map((indicator: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {validationData.recommendations && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Target className="h-5 w-5 text-accent" />
                  <span>AI Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {validationData.recommendations.map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/20"
                    >
                      <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          {/* Opportunities */}
          {validationData.opportunities && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationData.opportunities.map((opp: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">{opp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {validationData.risk_factors && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Risk Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {validationData.risk_factors.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-muted-foreground">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {idea.status === "validated" ? (
                <>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link href={`/dashboard/mvp/new?ideaId=${idea.id}`}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Build MVP
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/dashboard/pitch/new?ideaId=${idea.id}`}>Create Pitch Deck</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/dashboard/ideas/new`}>Refine Idea</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard/network">Get Feedback</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
