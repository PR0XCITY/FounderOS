import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      pitch_type,
      funding_goal,
      business_model,
      target_market,
      team_info,
      traction_metrics,
      competitive_advantage,
      idea_id,
      mvp_id,
    } = body

    // Generate slides based on input data
    const slides = generatePitchSlides({
      title,
      description,
      pitch_type,
      funding_goal,
      business_model,
      target_market,
      team_info,
      traction_metrics,
      competitive_advantage,
    })

    // Save to database
    const { data, error } = await supabase
      .from("pitch_decks")
      .insert({
        user_id: user.id,
        idea_id: idea_id || null,
        mvp_id: mvp_id || null,
        title,
        description,
        pitch_type,
        slides,
        status: "completed",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save pitch deck" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pitch_deck: data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to generate pitch deck slides
function generatePitchSlides(data: any) {
  return [
    {
      title: "Title Slide",
      content: {
        title: data.title,
        subtitle: data.description,
        presenter: "Founder & CEO",
        date: new Date().toLocaleDateString(),
      },
    },
    {
      title: "Problem",
      content: {
        title: "The Problem We're Solving",
        description: "Market problem that creates significant pain points for our target audience",
        pain_points: [
          "Current solutions are inadequate",
          "Market gap creates inefficiencies",
          "Users struggle with existing options",
        ],
        market_validation: "85% of target market experiences this issue daily",
      },
    },
    {
      title: "Solution",
      content: {
        title: "Our Solution",
        description: data.description,
        key_benefits: ["Solves core problem efficiently", "User-friendly and accessible", "Scalable and sustainable"],
        competitive_advantage: data.competitive_advantage,
      },
    },
    {
      title: "Market Opportunity",
      content: {
        title: "Market Opportunity",
        tam: "$10B Total Addressable Market",
        sam: "$2.5B Serviceable Addressable Market",
        som: "$250M Serviceable Obtainable Market",
        target_market: data.target_market,
        growth_rate: "15% CAGR over next 5 years",
      },
    },
    {
      title: "Business Model",
      content: {
        title: "How We Make Money",
        description: data.business_model,
        revenue_streams: ["Primary subscription model", "Premium feature upgrades", "Enterprise partnerships"],
        pricing_strategy: "Freemium model with premium tiers",
      },
    },
    {
      title: "Traction",
      content: {
        title: "Traction & Key Metrics",
        description: data.traction_metrics,
        key_metrics: ["User growth rate", "Revenue milestones", "Market validation"],
        achievements: ["Product-market fit achieved", "Key partnerships secured", "Awards and recognition"],
      },
    },
    {
      title: "Competition",
      content: {
        title: "Competitive Landscape",
        description: "Analysis of current market players and our positioning",
        competitors: ["Direct competitor A", "Direct competitor B", "Indirect competitor C"],
        differentiation: data.competitive_advantage,
      },
    },
    {
      title: "Team",
      content: {
        title: "Our Team",
        description: data.team_info,
        key_roles: ["CEO - Vision and strategy", "CTO - Technical leadership", "CMO - Growth and marketing"],
        advisors: ["Industry expert advisor", "Technical advisor", "Business development advisor"],
      },
    },
    {
      title: "Financial Projections",
      content: {
        title: "Financial Projections",
        description: "5-year revenue and growth projections",
        projections: {
          year1: "$100K ARR",
          year2: "$500K ARR",
          year3: "$2M ARR",
          year4: "$5M ARR",
          year5: "$10M ARR",
        },
        key_assumptions: ["Customer acquisition cost", "Lifetime value", "Market penetration rate"],
      },
    },
    {
      title: "Funding Request",
      content: {
        title: "Investment Opportunity",
        funding_goal: data.funding_goal,
        use_of_funds: [
          "Product development - 40%",
          "Marketing and sales - 30%",
          "Team expansion - 20%",
          "Operations - 10%",
        ],
        milestones: ["Achieve product-market fit", "Scale to 10K users", "Expand to new markets"],
        timeline: "18-month runway to next milestone",
      },
    },
    {
      title: "Thank You",
      content: {
        title: "Thank You",
        subtitle: "Questions & Discussion",
        contact: {
          email: "founder@company.com",
          website: "www.company.com",
          linkedin: "linkedin.com/company/startup",
        },
        next_steps: "Let's discuss how we can work together",
      },
    },
  ]
}
