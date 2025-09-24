"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SlideEditor } from "@/components/slide-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditPitchDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [pitchDeck, setPitchDeck] = useState<any>(null)
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchPitchDeck = async () => {
      const { id } = await params
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("pitch_decks")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        router.push("/dashboard/pitch")
        return
      }

      setPitchDeck(data)
      setSlides(data.slides || [])
      setLoading(false)
    }

    fetchPitchDeck()
  }, [params, router])

  const handleSave = async () => {
    if (!pitchDeck) return

    setSaving(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("pitch_decks").update({ slides }).eq("id", pitchDeck.id)

      if (error) throw error

      router.push(`/dashboard/pitch/${pitchDeck.id}`)
    } catch (error) {
      console.error("Error saving slides:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/pitch/${pitchDeck?.id}`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Pitch Deck</h1>
            <p className="text-muted-foreground">{pitchDeck?.title}</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Editor */}
      <div className="h-[calc(100vh-200px)]">
        <SlideEditor slides={slides} onSlidesChange={setSlides} onSave={handleSave} />
      </div>
    </div>
  )
}
