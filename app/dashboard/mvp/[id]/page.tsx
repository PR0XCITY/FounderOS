import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Code, Globe, ExternalLink, Download, Rocket, Eye, Settings, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function MVPDetailsPage({
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

  // Get the specific MVP project
  const { data: project, error: projectError } = await supabase
    .from("mvp_projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

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
        return "Ready to Deploy"
      case "generating":
        return "Building"
      case "deployed":
        return "Live"
      default:
        return "Planning"
    }
  }

  const wireframes = (project.wireframes as any[]) || []
  const features = (project.features as string[]) || []
  const techStack = (project.tech_stack as string[]) || []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/mvp" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground mt-1">Created on {new Date(project.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
          {project.status === "completed" && !project.deployment_url && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href={`/dashboard/mvp/${project.id}/deploy`}>
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </Link>
            </Button>
          )}
          {project.deployment_url && (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href={project.deployment_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Project Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-medium text-foreground mb-1">Features</h4>
              <p className="text-2xl font-bold text-accent">{features.length}</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Tech Stack</h4>
              <p className="text-lg font-semibold text-foreground">{techStack.join(", ")}</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Status</h4>
              <p className="text-lg font-semibold text-foreground">{getStatusText(project.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="wireframes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wireframes">Wireframes</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="wireframes" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Eye className="h-5 w-5 text-accent" />
                <span>Wireframes & Mockups</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wireframes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wireframes.map((wireframe, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={wireframe.url || "/placeholder.svg"}
                          alt={wireframe.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-foreground">{wireframe.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No wireframes available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Settings className="h-5 w-5 text-accent" />
                <span>Features & Functionality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg border border-accent/20"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No features defined</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Code className="h-5 w-5 text-accent" />
                  <span>Generated Code</span>
                </CardTitle>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.generated_code ? (
                <div className="bg-muted/20 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-foreground whitespace-pre-wrap">
                    <code>{project.generated_code}</code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No code generated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Settings className="h-5 w-5 text-accent" />
                <span>Project Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-accent border-accent/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Deployment</h4>
                  {project.deployment_url ? (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <Link
                        href={project.deployment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline"
                      >
                        {project.deployment_url}
                      </Link>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Not deployed yet</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Project
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
