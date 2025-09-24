import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lightbulb, Code, FileText, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-semibold text-foreground">FounderOS</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-accent">
            AI-Powered Startup Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
            Your AI co-founder for <span className="text-accent">building startups</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-relaxed">
            The complete platform for non-technical entrepreneurs to validate ideas, build MVPs, and scale startups with
            AI-powered tools and guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3"
              asChild
            >
              <Link href="/auth/sign-up">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-muted-foreground mb-8">Trusted by entrepreneurs worldwide</p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold">TechCrunch</div>
            <div className="text-2xl font-bold">Forbes</div>
            <div className="text-2xl font-bold">Y Combinator</div>
            <div className="text-2xl font-bold">Product Hunt</div>
            <div className="text-2xl font-bold">AngelList</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">Everything you need to build a startup</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              From idea validation to investor-ready pitches, FounderOS provides all the tools and guidance you need in
              one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Idea Validation Engine</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered market research, competitor analysis, and validation frameworks to test your startup idea
                before you build.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">No-Code MVP Generator</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Build functional prototypes and MVPs without coding. Generate landing pages, apps, and workflows with AI
                assistance.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Legal & Finance Auto-Setup</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Automated business registration, legal document generation, and financial setup to get your startup
                legally compliant.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Go-to-Market Playbooks</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Customized marketing strategies, launch plans, and growth tactics tailored to your industry and target
                market.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Investor-Ready Deck Builder</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                AI-generated pitch decks, financial projections, and investor materials that follow proven frameworks
                and best practices.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Founder Network Matching</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Connect with co-founders, advisors, and mentors based on your needs, skills, and startup stage.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-muted-foreground">Startups Launched</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">$500M+</div>
              <div className="text-muted-foreground">Funding Raised</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">85%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">30 Days</div>
              <div className="text-muted-foreground">Average MVP Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">
              From idea to launch in weeks, not months
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform guides you through every step of building a startup, providing tools and expertise
              when you need them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Validate Your Idea</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our AI validation engine to research your market, analyze competitors, and validate demand before
                building.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Build Your MVP</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create functional prototypes and MVPs using our no-code tools and AI-generated components.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Launch & Scale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Execute go-to-market strategies, pitch to investors, and scale your startup with ongoing AI guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-6">Ready to build your startup?</h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
            Join thousands of entrepreneurs who have successfully launched their startups with FounderOS. Start your
            journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3"
              asChild
            >
              <Link href="/auth/sign-up">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-semibold">FounderOS</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your AI co-founder for building successful startups.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 FounderOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
