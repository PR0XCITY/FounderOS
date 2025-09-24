"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Trash2, Move, Eye, Type, ImageIcon, BarChart } from "lucide-react"

interface SlideEditorProps {
  slides: any[]
  onSlidesChange: (slides: any[]) => void
  onSave: () => void
}

const slideTemplates = [
  { id: "title", name: "Title Slide", icon: Type },
  { id: "content", name: "Content Slide", icon: Type },
  { id: "image", name: "Image Slide", icon: ImageIcon },
  { id: "chart", name: "Chart Slide", icon: BarChart },
]

export function SlideEditor({ slides, onSlidesChange, onSave }: SlideEditorProps) {
  const [selectedSlide, setSelectedSlide] = useState(0)
  const [isPreview, setIsPreview] = useState(false)

  const addSlide = (template: string) => {
    const newSlide = {
      title: "New Slide",
      content: {
        title: "Slide Title",
        description: "Slide content goes here...",
      },
      template,
    }
    const newSlides = [...slides, newSlide]
    onSlidesChange(newSlides)
    setSelectedSlide(newSlides.length - 1)
  }

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return
    const newSlides = slides.filter((_, i) => i !== index)
    onSlidesChange(newSlides)
    setSelectedSlide(Math.max(0, selectedSlide - 1))
  }

  const moveSlide = (from: number, to: number) => {
    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(from, 1)
    newSlides.splice(to, 0, movedSlide)
    onSlidesChange(newSlides)
    setSelectedSlide(to)
  }

  const updateSlide = (index: number, updates: any) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], ...updates }
    onSlidesChange(newSlides)
  }

  const currentSlide = slides[selectedSlide]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Slide List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Slides</h3>
          <Select onValueChange={addSlide}>
            <SelectTrigger className="w-auto">
              <Plus className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {slideTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center space-x-2">
                    <template.icon className="h-4 w-4" />
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {slides.map((slide, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-colors ${
                selectedSlide === index ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedSlide(index)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{slide.title}</p>
                    <p className="text-xs text-muted-foreground">Slide {index + 1}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (index > 0) moveSlide(index, index - 1)
                      }}
                      disabled={index === 0}
                    >
                      <Move className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSlide(index)
                      }}
                      disabled={slides.length <= 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            Edit Slide {selectedSlide + 1}: {currentSlide?.title}
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)} className="bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button onClick={onSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {isPreview ? (
          <Card className="bg-card border-border">
            <CardContent className="aspect-video p-12 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">{currentSlide?.content?.title}</h2>
                <p className="text-lg text-muted-foreground">{currentSlide?.content?.description}</p>
                {currentSlide?.content?.features && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {currentSlide.content.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Slide Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slide-title" className="text-foreground">
                      Slide Title
                    </Label>
                    <Input
                      id="slide-title"
                      value={currentSlide?.title || ""}
                      onChange={(e) => updateSlide(selectedSlide, { title: e.target.value })}
                      className="bg-input border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-title" className="text-foreground">
                      Content Title
                    </Label>
                    <Input
                      id="content-title"
                      value={currentSlide?.content?.title || ""}
                      onChange={(e) =>
                        updateSlide(selectedSlide, {
                          content: { ...currentSlide?.content, title: e.target.value },
                        })
                      }
                      className="bg-input border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-description" className="text-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="content-description"
                      value={currentSlide?.content?.description || ""}
                      onChange={(e) =>
                        updateSlide(selectedSlide, {
                          content: { ...currentSlide?.content, description: e.target.value },
                        })
                      }
                      className="bg-input border-border text-foreground min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Design Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Background</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Layout</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="left">Left Aligned</SelectItem>
                        <SelectItem value="right">Right Aligned</SelectItem>
                        <SelectItem value="split">Split Screen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animation" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Animation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Entrance Animation</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade In</SelectItem>
                        <SelectItem value="slide">Slide In</SelectItem>
                        <SelectItem value="zoom">Zoom In</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Transition Speed</Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
