import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Code, Globe, Smartphone, Database, Clock, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function MVPPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's MVP projects
  const { data: projects } = await supabase
    .from("mvp_projects")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "generating":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "deployed":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Ready"
      case "generating":
        return "Building"
      case "deployed":
        return "Live"
      default:
        return "Planning"
    }
  }

  const getProjectTypeIcon = (techStack: any) => {
    const stack = Array.isArray(techStack) ? techStack : []
    if (stack.includes("React Native") || stack.includes("Flutter")) {
      return <Smartphone className="h-4 w-4 text-accent" />
    } else if (stack.includes("Next.js") || stack.includes("React")) {
      return <Globe className="h-4 w-4 text-accent" />
    } else if (stack.includes("API") || stack.includes("Backend")) {
      return <Database className="h-4 w-4 text-accent" />
    }
    return <Code className="h-4 w-4 text-accent" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MVP Builder</h1>
          <p className="text-muted-foreground mt-2">
            Build functional prototypes and MVPs with AI-powered no-code tools
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/dashboard/mvp/new">
            <Plus className="h-4 w-4 mr-2" />
            New MVP
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Total MVPs</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{projects?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Deployed</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {projects?.filter((project) => project.status === "deployed").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {projects?.filter((project) => project.status === "generating").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Build Time</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">2.5h</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getProjectTypeIcon(project.tech_stack)}
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Code className="h-3 w-3" />
                        <span>
                          Tech: {Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {project.features && Array.isArray(project.features) && project.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.features.slice(0, 3).map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {project.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/mvp/${project.id}`}>View Details</Link>
                    </Button>
                    {project.deployment_url && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href={project.deployment_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Live
                        </Link>
                      </Button>
                    )}
                    {project.status === "completed" && !project.deployment_url && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href={`/dashboard/mvp/${project.id}/deploy`}>
                          Deploy <ArrowRight className="h-3 w-3 ml-1" />
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
                <Code className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No MVPs yet</h3>
              <p className="text-muted-foreground mb-6">
                Transform your validated ideas into functional prototypes with our AI-powered MVP builder
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/dashboard/mvp/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Build Your First MVP
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
