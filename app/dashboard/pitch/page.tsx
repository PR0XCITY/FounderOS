import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Eye, Share, Clock, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function PitchPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's pitch decks
  const { data: pitchDecks } = await supabase
    .from("pitch_decks")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

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
        return "Ready"
      case "generating":
        return "Building"
      case "shared":
        return "Shared"
      default:
        return "Draft"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pitch Deck Builder</h1>
          <p className="text-muted-foreground mt-2">
            Create investor-ready presentations with AI-powered content generation
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/dashboard/pitch/new">
            <Plus className="h-4 w-4 mr-2" />
            New Pitch Deck
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Total Decks</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{pitchDecks?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {pitchDecks?.filter((deck) => deck.status === "completed").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">Shared</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">
              {pitchDecks?.filter((deck) => deck.status === "shared").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Avg. Views</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">24</div>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Decks List */}
      <div className="space-y-4">
        {pitchDecks && pitchDecks.length > 0 ? (
          pitchDecks.map((deck) => (
            <Card key={deck.id} className="bg-card border-border hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-5 w-5 text-accent" />
                      <h3 className="text-lg font-semibold text-foreground">{deck.title}</h3>
                      <Badge className={getStatusColor(deck.status)}>{getStatusText(deck.status)}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{deck.description}</p>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Slides: {Array.isArray(deck.slides) ? deck.slides.length : 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Created: {new Date(deck.created_at).toLocaleDateString()}</span>
                      </div>
                      {deck.presentation_url && (
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Views: {Math.floor(Math.random() * 50) + 10}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/pitch/${deck.id}`}>View Details</Link>
                    </Button>
                    {deck.presentation_url && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href={deck.presentation_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Present
                        </Link>
                      </Button>
                    )}
                    {deck.status === "completed" && !deck.presentation_url && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <Link href={`/dashboard/pitch/${deck.id}/present`}>
                          Present <ArrowRight className="h-3 w-3 ml-1" />
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
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No pitch decks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create compelling investor presentations with our AI-powered pitch deck builder
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/dashboard/pitch/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Pitch Deck
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
