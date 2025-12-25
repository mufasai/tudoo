"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Settings, Mail, Info } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-600/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none"></div>

      <Header onAddTask={() => {}} />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 max-w-3xl mx-auto pb-12">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Information Card */}
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <CardHeader className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center border border-blue-500/30">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Account Information</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">Your account details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email Address</p>
                    <p className="text-white font-medium">{user?.email || "Loading..."}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                    Verified
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Tudoo Card */}
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <CardHeader className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-800/20 flex items-center justify-center border border-purple-500/30">
                    <Info className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">About Tudoo</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">Version and information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Version</p>
                    <p className="text-white font-medium">1.0.0</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                    Latest
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Built with</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                      Next.js
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-600/20 to-green-800/20 border border-green-500/30 text-green-300 text-xs font-medium">
                      Supabase
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                      TailwindCSS
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
