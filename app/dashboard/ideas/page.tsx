import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Lightbulb, TrendingUp, Users, DollarSign, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function IdeasPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's startup ideas
  const { data: ideas } = await supabase
    .from("startup_ideas")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

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
        return "Validating"
      case "rejected":
        return "Needs Work"
      default:
        return "Draft"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Idea Validation</h1>
          <p className="text-muted-foreground mt-2">
            Validate your startup ideas with AI-powered market research and analysis
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/dashboard/ideas/new">
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Total Ideas</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{ideas?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Validated</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {ideas?.filter((idea) => idea.status === "validated").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {ideas?.filter((idea) => idea.status === "validating").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Score</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {ideas?.length
                ? Math.round(ideas.reduce((acc, idea) => acc + (idea.validation_score || 0), 0) / ideas.length)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas && ideas.length > 0 ? (
          ideas.map((idea) => (
            <Card key={idea.id} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{idea.title}</h3>
                      <Badge className={getStatusColor(idea.status)}>{getStatusText(idea.status)}</Badge>
                      {idea.validation_score > 0 && (
                        <Badge variant="outline" className="text-accent border-accent/20">
                          Score: {idea.validation_score}/100
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{idea.description}</p>

                    {idea.target_market && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Target: {idea.target_market}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Created: {new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/ideas/${idea.id}`}>View Details</Link>
                    </Button>
                    {idea.status === "validated" && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href={`/dashboard/mvp/new?ideaId=${idea.id}`}>
                          Build MVP <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your entrepreneurial journey by validating your first startup idea
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/dashboard/ideas/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Validate Your First Idea
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
