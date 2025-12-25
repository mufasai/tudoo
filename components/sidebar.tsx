"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckCircle2, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/completed", label: "Completed", icon: CheckCircle2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tudoo
          </span>
        </Link>
      </div>

      {/* Navigation - grows to fill available space */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-3 h-11 transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-purple-600/15 to-blue-600/15 text-sidebar-foreground border border-purple-500/40 shadow-sm dark:from-purple-600/20 dark:to-blue-600/20 dark:border-purple-500/30" 
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                asChild
              >
                <span>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section - always visible */}
      <div className="p-4 border-t border-sidebar-border space-y-2 flex-shrink-0">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent border border-transparent hover:border-sidebar-border transition-all" 
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}