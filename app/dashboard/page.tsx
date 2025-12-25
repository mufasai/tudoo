"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { AddTaskModal } from "@/components/add-task-modal"
import { EditTaskModal } from "@/components/edit-task-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done"
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>()
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      toast.error("Failed to load tasks")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (title: string, description: string) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title,
            description: description || null,
            status: "todo",
            user_id: user.id,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        setTasks([data[0], ...tasks])
        toast.success("Task created successfully!")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create task"
      toast.error(errorMessage)
      console.error("[v0] Task creation error:", error)
    }
  }

  const handleEditTask = async (id: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title,
          description: description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, title, description } : t)))
      toast.success("Task updated successfully!")
    } catch (error) {
      toast.error("Failed to update task")
      console.error(error)
    }
  }

  const handleStatusChange = async (id: string, status: "todo" | "in-progress" | "done") => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)))
      toast.success(`Task marked as ${status}!`)
    } catch (error) {
      toast.error("Failed to update task status")
      console.error(error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id)

      if (error) throw error
      setTasks(tasks.filter((t) => t.id !== id))
      toast.success("Task deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete task")
      console.error(error)
    }
  }

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  return (
    <div className="min-h-screen bg-background">
      <Header onAddTask={() => setAddModalOpen(true)} />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/30">
                <span className="text-4xl">📝</span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-foreground text-xl font-medium">No tasks yet</p>
                <p className="text-muted-foreground">Start your productivity journey</p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Create your first task
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                  <h2 className="text-xl font-semibold text-foreground">
                    To Do <span className="text-muted-foreground text-sm ml-2">({todoTasks.length})</span>
                  </h2>
                </div>
                <AnimatePresence>
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onEdit={(id) => {
                        setSelectedTask(tasks.find((t) => t.id === id))
                        setEditModalOpen(true)
                      }}
                      onDelete={(id) => {
                        setTaskToDelete(tasks.find((t) => t.id === id))
                        setDeleteModalOpen(true)
                      }}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-800 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                  <h2 className="text-xl font-semibold text-foreground">
                    In Progress <span className="text-muted-foreground text-sm ml-2">({inProgressTasks.length})</span>
                  </h2>
                </div>
                <AnimatePresence>
                  {inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onEdit={(id) => {
                        setSelectedTask(tasks.find((t) => t.id === id))
                        setEditModalOpen(true)
                      }}
                      onDelete={(id) => {
                        setTaskToDelete(tasks.find((t) => t.id === id))
                        setDeleteModalOpen(true)
                      }}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Done Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-600 to-green-800 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Done <span className="text-muted-foreground text-sm ml-2">({doneTasks.length})</span>
                  </h2>
                </div>
                <AnimatePresence>
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      {...task}
                      onEdit={(id) => {
                        setSelectedTask(tasks.find((t) => t.id === id))
                        setEditModalOpen(true)
                      }}
                      onDelete={(id) => {
                        setTaskToDelete(tasks.find((t) => t.id === id))
                        setDeleteModalOpen(true)
                      }}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal open={addModalOpen} onOpenChange={setAddModalOpen} onSubmit={handleAddTask} />

      <EditTaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={selectedTask}
        onSubmit={handleEditTask}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        taskTitle={taskToDelete?.title || ""}
        onConfirm={() => handleDeleteTask(taskToDelete?.id || "")}
      />
    </div>
  )
}