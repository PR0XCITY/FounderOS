import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Zap, Crown, Rocket } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for validating your first startup idea",
      price: "Free",
      priceSubtext: "Forever",
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      features: [
        "1 idea validation per month",
        "Basic market research",
        "Simple MVP wireframes", 
        "Basic pitch deck template",
        "Community access",
        "Email support"
      ],
      limitations: [
        "Limited AI analysis depth",
        "No priority support",
        "Watermarked outputs"
      ],
      cta: "Get Started Free",
      ctaVariant: "outline" as const,
      popular: false
    },
    {
      name: "Founder",
      description: "For serious entrepreneurs building their startup",
      price: "$49",
      priceSubtext: "per month",
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      features: [
        "Unlimited idea validations",
        "Comprehensive market research",
        "Advanced MVP generation",
        "Professional pitch decks",
        "Legal document templates",
        "Growth strategy playbooks",
        "1-on-1 founder coaching (2 hours/month)",
        "Priority support",
        "API access"
      ],
      limitations: [],
      cta: "Start Free Trial",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Scale",
      description: "For growing startups and serial entrepreneurs",
      price: "$149",
      priceSubtext: "per month",
      icon: <Rocket className="h-6 w-6 text-orange-500" />,
      features: [
        "Everything in Founder plan",
        "Team collaboration (up to 5 members)",
        "Advanced analytics & reporting",
        "Custom AI model fine-tuning",
        "Investor network access",
        "Legal compliance automation",
        "Weekly founder coaching (4 hours/month)",
        "White-label options",
        "Custom integrations",
        "24/7 priority support"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false
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
                <Link href="/pricing" className="text-foreground font-medium">
                  Pricing
                </Link>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
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
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Choose the right plan for your <span className="text-accent">startup journey</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            From idea validation to scaling success, our plans grow with your startup. All plans include 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative p-6 ${
                  plan.popular 
                    ? 'border-accent shadow-2xl scale-105' 
                    : 'border-border hover:border-accent/50'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <div className="text-4xl font-bold">{plan.price}</div>
                    <div className="text-muted-foreground">{plan.priceSubtext}</div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    className="w-full mb-6" 
                    variant={plan.ctaVariant}
                    size="lg"
                    asChild
                  >
                    <Link href="/auth/sign-up">
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <div className="text-xs text-muted-foreground mb-2">Limitations:</div>
                        {plan.limitations.map((limitation) => (
                          <div key={limitation} className="flex items-center space-x-3">
                            <div className="h-1 w-1 bg-muted-foreground rounded-full flex-shrink-0 mt-2" />
                            <span className="text-xs text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Yes! All paid plans include a 14-day free trial with full access to features. No credit card required to start.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Absolutely. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Is there a discount for annual payments?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Yes! Save 20% when you pay annually. Contact us for custom pricing for enterprise needs.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">What if I exceed my plan limits?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We'll notify you when approaching limits. You can upgrade anytime or purchase add-ons for additional usage.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We offer a 30-day money-back guarantee. If you're not satisfied, we'll provide a full refund.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start building?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of entrepreneurs who have successfully launched their startups with FounderOS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3" asChild>
              <Link href="/auth/sign-up">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Contact Sales
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