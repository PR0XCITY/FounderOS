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
    const { title, description, problem_statement, solution_approach, target_market } = body

    // Simulate AI validation process
    // In a real implementation, this would call external APIs for market research
    const validationScore = Math.floor(Math.random() * 40) + 60 // 60-100 range

    const validationData = {
      market_size: generateMarketSize(),
      competition_level: generateCompetitionLevel(),
      demand_indicators: generateDemandIndicators(),
      risk_factors: generateRiskFactors(),
      opportunities: generateOpportunities(),
      recommendations: generateRecommendations(validationScore),
    }

    // Save to database
    const { data, error } = await supabase
      .from("startup_ideas")
      .insert({
        user_id: user.id,
        title,
        description,
        problem_statement,
        solution_approach,
        target_market,
        validation_score: validationScore,
        validation_data: validationData,
        status: validationScore >= 70 ? "validated" : "validating",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save idea" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      idea: data,
      validation_score: validationScore,
      validation_data: validationData,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions to generate mock validation data
function generateMarketSize() {
  const sizes = ["$500M", "$1.2B", "$2.5B", "$5.8B", "$12B"]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

function generateCompetitionLevel() {
  const levels = ["Low", "Medium", "High"]
  return levels[Math.floor(Math.random() * levels.length)]
}

function generateDemandIndicators() {
  const indicators = [
    "Growing search trends",
    "Active communities discussing the problem",
    "Existing solutions with significant gaps",
    "Increasing market adoption",
    "Positive social media sentiment",
    "Industry reports showing growth",
  ]
  return indicators.slice(0, Math.floor(Math.random() * 3) + 2)
}

function generateRiskFactors() {
  const risks = [
    "Market saturation",
    "High customer acquisition cost",
    "Regulatory challenges",
    "Technology barriers",
    "Strong incumbent players",
    "Long sales cycles",
  ]
  return risks.slice(0, Math.floor(Math.random() * 2) + 1)
}

function generateOpportunities() {
  const opportunities = [
    "Underserved niche market",
    "Technology advancement enabling new solutions",
    "Changing user behavior patterns",
    "Regulatory changes creating opportunities",
    "Economic trends favoring the solution",
    "Partnership opportunities",
  ]
  return opportunities.slice(0, Math.floor(Math.random() * 3) + 2)
}

function generateRecommendations(score: number) {
  const baseRecs = [
    "Focus on a specific user segment initially",
    "Validate with potential customers through interviews",
    "Consider MVP features carefully to test core assumptions",
  ]

  if (score >= 80) {
    baseRecs.push("Strong validation - proceed with MVP development")
  } else if (score >= 60) {
    baseRecs.push("Good potential - gather more customer feedback before building")
  } else {
    baseRecs.push("Consider pivoting or refining the core value proposition")
  }

  return baseRecs
}
