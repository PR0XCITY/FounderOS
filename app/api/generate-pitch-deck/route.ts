import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generatePitchDeck } from "@/lib/gemini"
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

    // Use Gemini AI for real pitch deck generation
    let slides, executiveSummary, keyMetrics, investmentHighlights
    
    try {
      const aiResult = await generatePitchDeck({
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
      
      slides = aiResult.slides
      executiveSummary = aiResult.executive_summary
      keyMetrics = aiResult.key_metrics
      investmentHighlights = aiResult.investment_highlights
    } catch (error) {
      console.error('AI pitch deck generation failed:', error)
      return NextResponse.json(
        { error: "Failed to generate pitch deck with AI. Please try again." },
        { status: 500 }
      )
    }

    // Save to database using admin client
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("pitch_decks")
      .insert({
        user_id: user.id,
        idea_id: idea_id || null,
        mvp_id: mvp_id || null,
        title,
        description,
        pitch_type,
        slides,
        executive_summary: executiveSummary,
        key_metrics: keyMetrics,
        investment_highlights: investmentHighlights,
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

