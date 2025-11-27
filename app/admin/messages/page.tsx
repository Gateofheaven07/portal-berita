"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash2, ChevronLeft, Mail } from "lucide-react"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const { user, loading } = useProtectedRoute()
  const [messages, setMessages] = useState<Message[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchMessages()
    }
  }, [user])

  async function fetchMessages() {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setPageLoading(false)
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Hapus pesan ini?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id))
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="text-white shadow-lg" style={{ background: '#1E3A8A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/admin/dashboard" className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Pesan Masuk</h1>
            <p className="opacity-90 mt-1">{messages.length} pesan</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Belum ada pesan masuk</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{msg.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      Dari: {msg.name} ({msg.email})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
