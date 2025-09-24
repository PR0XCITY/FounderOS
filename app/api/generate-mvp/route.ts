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
    const { name, description, features, tech_stack, custom_requirements, idea_id } = body

    // Simulate MVP generation process
    // In a real implementation, this would:
    // 1. Generate wireframes using AI
    // 2. Create code templates based on tech stack
    // 3. Set up project structure
    // 4. Generate documentation

    const wireframes = generateWireframes(features)
    const generatedCode = generateCodeStructure(tech_stack, features)

    // Save to database
    const { data, error } = await supabase
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

// Helper functions to generate mock MVP components
function generateWireframes(features: string[]) {
  const wireframes = [
    { name: "Landing Page", url: "/landing-page-wireframe.jpg" },
    { name: "Dashboard", url: "/dashboard-wireframe.png" },
  ]

  if (features.includes("User Profiles")) {
    wireframes.push({ name: "User Profile", url: "/user-profile-wireframe.jpg" })
  }

  if (features.includes("Admin Panel")) {
    wireframes.push({ name: "Admin Panel", url: "/admin-panel-wireframe.jpg" })
  }

  return wireframes
}

function generateCodeStructure(techStack: string[], features: string[]) {
  let code = `// Generated MVP Structure\n// Technology Stack: ${techStack.join(", ")}\n\n`

  if (techStack.includes("nextjs")) {
    code += `// Next.js App Structure
app/
  layout.tsx
  page.tsx
  globals.css
`
  }

  if (techStack.includes("react-native")) {
    code += `// React Native App Structure
src/
  components/
  screens/
  navigation/
  services/
`
  }

  code += `\n// Features implemented:\n`
  features.forEach((feature) => {
    code += `// - ${feature}\n`
  })

  code += `\n// Main App Component
function App() {
  return (
    <div className="app">
      <Header />
      <Router>
        <Routes>
          <Route path="/" component={LandingPage} />
`

  if (features.includes("Dashboard")) {
    code += `          <Route path="/dashboard" component={Dashboard} />\n`
  }

  if (features.includes("User Profiles")) {
    code += `          <Route path="/profile" component={UserProfile} />\n`
  }

  code += `        </Routes>
      </Router>
      <Footer />
    </div>
  );
}`

  return code
}


