import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateStartupIdea } from "@/lib/gemini"
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

    // Use Gemini AI for real validation
    let validationData
    let validationScore
    
    try {
      const aiResult = await validateStartupIdea(
        title,
        description,
        problem_statement,
        solution_approach,
        target_market
      )
      
      validationData = {
        market_size: aiResult.market_size,
        competition_level: aiResult.competition_level,
        demand_indicators: aiResult.demand_indicators,
        risk_factors: aiResult.risk_factors,
        opportunities: aiResult.opportunities,
        recommendations: aiResult.recommendations,
      }
      
      validationScore = aiResult.validation_score
    } catch (error) {
      console.error('AI validation failed:', error)
      return NextResponse.json(
        { error: "Failed to validate idea with AI. Please try again." },
        { status: 500 }
      )
    }

    // Save to database using admin client
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
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

