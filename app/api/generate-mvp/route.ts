import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateMVP } from "@/lib/gemini"
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
    const { name, description, features, tech_stack, custom_requirements, idea_id } = body

    // Use Gemini AI for real MVP generation
    let wireframes, generatedCode, techRecommendations, timeline, cost, keyFeatures
    
    try {
      const aiResult = await generateMVP(
        name,
        description,
        features,
        tech_stack,
        custom_requirements
      )
      
      wireframes = aiResult.wireframes
      generatedCode = aiResult.code_structure
      techRecommendations = aiResult.tech_recommendations
      timeline = aiResult.development_timeline
      cost = aiResult.estimated_cost
      keyFeatures = aiResult.key_features
    } catch (error) {
      console.error('AI MVP generation failed:', error)
      return NextResponse.json(
        { error: "Failed to generate MVP with AI. Please try again." },
        { status: 500 }
      )
    }

    // Save to database using admin client
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from("mvp_projects")
      .insert({
        user_id: user.id,
        idea_id: idea_id || null,
        name,
        description,
        tech_stack,
        features,
        wireframes,
        generated_code: generatedCode,
        tech_recommendations: techRecommendations,
        timeline,
        estimated_cost: cost,
        key_features: keyFeatures,
        status: "completed",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save MVP project" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      project: data,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


