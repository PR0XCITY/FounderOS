import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Target, Users, Zap, Heart, Award, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Serial entrepreneur with 3 successful exits. Previously led product at Stripe and Airbnb.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Sarah Kim",
      role: "CTO & Co-Founder", 
      bio: "Former ML engineer at Google AI. PhD in Computer Science from Stanford.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Product",
      bio: "Product leader with 10+ years at Microsoft and Meta, focused on developer tools.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Growth",
      bio: "Growth expert who scaled 5 startups from 0 to $10M+ ARR. Former consultant at McKinsey.",
      image: "/placeholder-user.jpg"
    }
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Mission-Driven",
      description: "We believe every great idea deserves a chance to become reality, regardless of technical background."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Community First",
      description: "Building a supportive ecosystem where entrepreneurs can learn, grow, and succeed together."
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Innovation",
      description: "Pushing the boundaries of AI to democratize entrepreneurship and startup creation."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Empathy",
      description: "Understanding the struggles of non-technical founders and building solutions that truly help."
    }
  ]

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
                <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/about" className="text-foreground font-medium">
                  About
                </Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-accent">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Democratizing <span className="text-accent">entrepreneurship</span> with AI
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-relaxed">
            We believe that great ideas shouldn't be limited by technical barriers. FounderOS was born from the vision 
            to empower every entrepreneur with AI-driven tools and guidance.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Too many brilliant startup ideas never see the light of day because their creators lack technical skills 
                or entrepreneurial guidance. We're changing that.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                FounderOS combines cutting-edge AI with proven startup methodologies to provide every entrepreneur 
                with their own virtual co-founder - one that never sleeps, never judges, and is always ready to help 
                turn ideas into successful businesses.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">10,000+</div>
                  <div className="text-muted-foreground">Entrepreneurs Helped</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent mb-2">$500M+</div>
                  <div className="text-muted-foreground">Total Funding Raised</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center">
                <Globe className="h-20 w-20 text-accent/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do at FounderOS
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="p-6 text-center hover:border-accent/50 transition-colors">
                <CardContent className="pt-0">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experienced entrepreneurs and technologists passionate about empowering founders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="p-6 text-center hover:border-accent/50 transition-colors">
                <CardContent className="pt-0">
                  <div className="w-20 h-20 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-accent text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From idea to platform serving thousands of entrepreneurs worldwide
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2023 - The Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Founded by serial entrepreneurs who experienced firsthand the challenges of non-technical founders. 
                  Our mission: democratize startup creation with AI.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2024 - Building & Testing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Developed our AI-powered platform with input from 500+ beta users. Refined our idea validation, 
                  MVP generation, and pitch deck creation algorithms.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2025 - Global Launch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Officially launched FounderOS to the world. Now serving 10,000+ entrepreneurs across 50+ countries, 
                  with startups raising over $500M in total funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join our mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Be part of the movement that's empowering entrepreneurs worldwide to build successful startups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3" asChild>
              <Link href="/auth/sign-up">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Join Our Team
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
                <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/network" className="hover:text-foreground transition-colors">Network</Link></li>
                <li><Link href="/growth" className="hover:text-foreground transition-colors">Growth</Link></li>
                <li><Link href="/legal" className="hover:text-foreground transition-colors">Legal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
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