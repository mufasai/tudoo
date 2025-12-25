"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface HeaderProps {
  onAddTask: () => void
}

export function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-card/95">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Organize and track your work</p>
        </div>
        <Button 
          onClick={onAddTask} 
          className="gap-2 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </Button>
      </div>
    </header>
  )
}