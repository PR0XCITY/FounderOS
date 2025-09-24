"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Lightbulb, Code, FileText, Users, TrendingUp, Shield, Settings, LogOut, Menu, X, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Ideas", href: "/dashboard/ideas", icon: Lightbulb },
  { name: "MVP Builder", href: "/dashboard/mvp", icon: Code },
  { name: "Pitch Decks", href: "/dashboard/pitch", icon: FileText },
  { name: "Network", href: "/dashboard/network", icon: Users },
  { name: "Legal & Finance", href: "/dashboard/legal", icon: Shield },
  { name: "Growth", href: "/dashboard/growth", icon: TrendingUp },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-semibold text-foreground">FounderOS</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-card border-r border-border">
          <div className="flex items-center p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-semibold text-foreground">FounderOS</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 space-y-2 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/50">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xs">F</span>
            </div>
            <span className="text-lg font-semibold text-foreground">FounderOS</span>
          </Link>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {children}
      </div>
    </div>
  )
}
