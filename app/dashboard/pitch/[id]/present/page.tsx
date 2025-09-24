"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize, Minimize, Play, Pause } from "lucide-react"
import Link from "next/link"

export default function PresentPitchDeckPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [pitchDeck, setPitchDeck] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [loading, setLoading] = useState(true)
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
      setLoading(false)
    }

    fetchPitchDeck()
  }, [params, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlay && pitchDeck?.slides) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % pitchDeck.slides.length)
      }, 10000) // 10 seconds per slide
    }
    return () => clearInterval(interval)
  }, [isAutoPlay, pitchDeck?.slides])

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      nextSlide()
    } else if (e.key === "ArrowLeft") {
      prevSlide()
    } else if (e.key === "Escape") {
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [currentSlide, pitchDeck?.slides])

  const nextSlide = () => {
    if (pitchDeck?.slides && currentSlide < pitchDeck.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (!pitchDeck?.slides || pitchDeck.slides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No slides available</p>
          <Button asChild>
            <Link href={`/dashboard/pitch/${pitchDeck?.id}`}>Back to Pitch Deck</Link>
          </Button>
        </div>
      </div>
    )
  }

  const slides = pitchDeck.slides as any[]
  const currentSlideData = slides[currentSlide]

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : "p-6"}`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/pitch/${pitchDeck.id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{pitchDeck.title}</h1>
              <p className="text-muted-foreground">
                Slide {currentSlide + 1} of {slides.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsAutoPlay(!isAutoPlay)} className="bg-transparent">
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoPlay ? "Pause" : "Auto Play"}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="bg-transparent">
              <Maximize className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Slide Content */}
      <div className={`${isFullscreen ? "h-full flex flex-col" : "max-w-6xl mx-auto"}`}>
        <Card className={`${isFullscreen ? "flex-1 border-0 rounded-none" : ""} bg-card border-border`}>
          <CardContent className={`${isFullscreen ? "h-full flex flex-col justify-center" : "aspect-video"} p-12`}>
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-foreground mb-8">
                {currentSlideData.content?.title || currentSlideData.title}
              </h2>

              {/* Render different slide types */}
              {currentSlideData.title === "Title Slide" && (
                <div className="space-y-4">
                  <p className="text-xl text-muted-foreground">{currentSlideData.content?.subtitle}</p>
                  <p className="text-lg text-accent">{currentSlideData.content?.presenter}</p>
                  <p className="text-sm text-muted-foreground">{currentSlideData.content?.date}</p>
                </div>
              )}

              {currentSlideData.title === "Problem" && (
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {currentSlideData.content?.description}
                  </p>
                  {currentSlideData.content?.pain_points && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      {currentSlideData.content.pain_points.map((point: string, index: number) => (
                        <div key={index} className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                          <p className="text-sm text-foreground">{point}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentSlideData.content?.market_validation && (
                    <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-lg font-semibold text-accent">{currentSlideData.content.market_validation}</p>
                    </div>
                  )}
                </div>
              )}

              {currentSlideData.title === "Solution" && (
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {currentSlideData.content?.description}
                  </p>
                  {currentSlideData.content?.key_benefits && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      {currentSlideData.content.key_benefits.map((benefit: string, index: number) => (
                        <div key={index} className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <p className="text-sm text-foreground">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentSlideData.title === "Market Opportunity" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
                      <h4 className="font-semibold text-foreground mb-2">TAM</h4>
                      <p className="text-2xl font-bold text-accent">{currentSlideData.content?.tam}</p>
                    </div>
                    <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
                      <h4 className="font-semibold text-foreground mb-2">SAM</h4>
                      <p className="text-2xl font-bold text-accent">{currentSlideData.content?.sam}</p>
                    </div>
                    <div className="p-6 bg-accent/10 rounded-lg border border-accent/20">
                      <h4 className="font-semibold text-foreground mb-2">SOM</h4>
                      <p className="text-2xl font-bold text-accent">{currentSlideData.content?.som}</p>
                    </div>
                  </div>
                  {currentSlideData.content?.growth_rate && (
                    <p className="text-lg text-muted-foreground">{currentSlideData.content.growth_rate}</p>
                  )}
                </div>
              )}

              {currentSlideData.title === "Funding Request" && (
                <div className="space-y-6">
                  <div className="p-8 bg-accent/10 rounded-lg border border-accent/20">
                    <h3 className="text-3xl font-bold text-accent mb-2">Seeking</h3>
                    <p className="text-5xl font-bold text-foreground">{currentSlideData.content?.funding_goal}</p>
                  </div>
                  {currentSlideData.content?.use_of_funds && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {currentSlideData.content.use_of_funds.map((item: string, index: number) => (
                        <div key={index} className="p-4 bg-muted/20 rounded-lg">
                          <p className="text-sm text-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Default content for other slides */}
              {!["Title Slide", "Problem", "Solution", "Market Opportunity", "Funding Request"].includes(
                currentSlideData.title,
              ) && (
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {currentSlideData.content?.description}
                  </p>
                  {currentSlideData.content?.features && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {currentSlideData.content.features.map((feature: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div
          className={`${isFullscreen ? "absolute bottom-4 left-1/2 transform -translate-x-1/2" : "mt-6"} flex items-center justify-center space-x-4`}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-accent" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="bg-background/80 backdrop-blur-sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>

          {isFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-background/80 backdrop-blur-sm ml-4"
            >
              <Minimize className="h-4 w-4" />
              Exit
            </Button>
          )}
        </div>
      </div>

      {/* Slide counter in fullscreen */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-muted-foreground">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  )
}
