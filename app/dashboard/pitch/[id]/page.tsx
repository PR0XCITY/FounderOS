import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, Share, Eye, Edit, Presentation, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function PitchDeckDetailsPage({
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

  // Get the specific pitch deck
  const { data: pitchDeck, error: pitchError } = await supabase
    .from("pitch_decks")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (pitchError || !pitchDeck) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "generating":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shared":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Ready to Present"
      case "generating":
        return "Building"
      case "shared":
        return "Shared with Investors"
      default:
        return "Draft"
    }
  }

  const slides = (pitchDeck.slides as any[]) || []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/pitch" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{pitchDeck.title}</h1>
            <p className="text-muted-foreground mt-1">
              Created on {new Date(pitchDeck.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(pitchDeck.status)}>{getStatusText(pitchDeck.status)}</Badge>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href={`/dashboard/pitch/${pitchDeck.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href={`/dashboard/pitch/${pitchDeck.id}/present`}>
              <Presentation className="h-4 w-4 mr-2" />
              Present
            </Link>
          </Button>
        </div>
      </div>

      {/* Pitch Deck Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Pitch Deck Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{pitchDeck.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-medium text-foreground mb-1">Slides</h4>
              <p className="text-2xl font-bold text-accent">{slides.length}</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Pitch Type</h4>
              <p className="text-lg font-semibold text-foreground capitalize">
                {pitchDeck.pitch_type?.replace("-", " ")}
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Views</h4>
              <p className="text-lg font-semibold text-foreground">{Math.floor(Math.random() * 50) + 10}</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Status</h4>
              <p className="text-lg font-semibold text-foreground">{getStatusText(pitchDeck.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="slides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="slides">Slides</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <span>Slide Preview</span>
                </CardTitle>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Slides
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {slides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slides.map((slide, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20 p-4 flex flex-col justify-center">
                        <h4 className="font-semibold text-foreground text-center mb-2">{slide.title}</h4>
                        <div className="text-xs text-muted-foreground text-center">
                          {slide.content?.title && <p className="font-medium">{slide.content.title}</p>}
                          {slide.content?.description && (
                            <p className="mt-1 line-clamp-2">{slide.content.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{slide.title}</span>
                        <span className="text-xs text-muted-foreground">Slide {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No slides available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Pitch Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {slides.map((slide, index) => (
                <div key={index} className="p-4 bg-muted/10 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-3">{slide.title}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {slide.content?.title && (
                      <div>
                        <span className="font-medium text-foreground">Title: </span>
                        {slide.content.title}
                      </div>
                    )}
                    {slide.content?.description && (
                      <div>
                        <span className="font-medium text-foreground">Description: </span>
                        {slide.content.description}
                      </div>
                    )}
                    {slide.content?.features && (
                      <div>
                        <span className="font-medium text-foreground">Features: </span>
                        {slide.content.features.join(", ")}
                      </div>
                    )}
                    {slide.content?.metrics && (
                      <div>
                        <span className="font-medium text-foreground">Metrics: </span>
                        {slide.content.metrics.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-accent" />
                  <span>View Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <span className="text-sm font-medium text-foreground">Total Views</span>
                  <span className="text-lg font-bold text-accent">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Unique Viewers</span>
                  <span className="text-lg font-bold text-foreground">{Math.floor(Math.random() * 30) + 5}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Avg. Time Spent</span>
                  <span className="text-lg font-bold text-foreground">4:32</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Share className="h-5 w-5 text-accent" />
                  <span>Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium text-foreground mb-2">Share Link</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      https://founderos.com/pitch/{pitchDeck.id}
                    </code>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
