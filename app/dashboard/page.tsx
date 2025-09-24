import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  Code,
  FileText,
  Users,
  TrendingUp,
  Shield,
  Plus,
  ArrowRight,
  BarChart3,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get user's startup ideas count
  const { count: ideasCount } = await supabase
    .from("startup_ideas")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  // Get user's MVP projects count
  const { count: projectsCount } = await supabase
    .from("mvp_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  // Get user's pitch decks count
  const { count: decksCount } = await supabase
    .from("pitch_decks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", data.user.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.full_name || data.user.email}!
              </h1>
              <p className="text-muted-foreground mt-2">Ready to build your next startup? Let's get started.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-accent">
                Founder Plan
              </Badge>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ideas Validated</CardTitle>
              <Lightbulb className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{ideasCount || 0}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MVPs Built</CardTitle>
              <Code className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{projectsCount || 0}</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pitch Decks</CardTitle>
              <FileText className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{decksCount || 0}</div>
              <p className="text-xs text-muted-foreground">Ready for investors</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">85%</div>
              <p className="text-xs text-muted-foreground">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tools & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Jump into building your startup with these essential tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent border-border hover:border-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/ideas">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">Validate New Idea</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Research market, analyze competitors, and validate demand
                      </p>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent border-border hover:border-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/mvp">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Code className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">Build MVP</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Create functional prototypes with no-code tools
                      </p>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent border-border hover:border-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/pitch">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">Create Pitch Deck</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">Generate investor-ready presentations</p>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent border-border hover:border-accent/50"
                    asChild
                  >
                    <Link href="/dashboard/network">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">Find Co-founders</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Connect with potential partners and advisors
                      </p>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your latest progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Welcome to FounderOS!</p>
                      <p className="text-xs text-muted-foreground">Account created successfully</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Just now</div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Validate your first idea</p>
                      <p className="text-xs text-muted-foreground">Get started with idea validation</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>

                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Code className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Build your first MVP</p>
                      <p className="text-xs text-muted-foreground">Create a functional prototype</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progress & Tips */}
          <div className="space-y-6">
            {/* Startup Journey Progress */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Startup Journey</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your progress through the startup building process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-accent-foreground" />
                    </div>
                    <span className="text-sm text-foreground">Account Setup</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-accent rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <span className="text-sm text-foreground">Idea Validation</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-muted rounded-full"></div>
                    <span className="text-sm text-muted-foreground">MVP Development</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-muted rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Market Launch</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-muted rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Fundraising</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">AI Recommendations</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Personalized next steps for your startup journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center mt-0.5">
                      <Lightbulb className="h-3 w-3 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Start with idea validation</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use our AI-powered validation engine to research your market and validate demand before
                        building.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 h-7 text-xs bg-transparent" asChild>
                        <Link href="/dashboard/ideas">
                          Get Started <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mt-0.5">
                      <Users className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Complete your profile</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add your skills and interests to get better co-founder matches.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Learning Hub</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Essential resources for startup success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Startup Playbook</p>
                      <p className="text-xs text-muted-foreground">Complete guide to building startups</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Market Research Guide</p>
                      <p className="text-xs text-muted-foreground">How to validate your ideas</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Legal Essentials</p>
                      <p className="text-xs text-muted-foreground">Business formation and compliance</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
