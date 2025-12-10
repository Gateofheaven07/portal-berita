"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash2, ChevronLeft, MessageSquare, ExternalLink } from "lucide-react"
import { formatDateFull } from "@/lib/date-utils"

interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: string
  updatedAt: string
  articleId: string
  articleTitle: string | null
  articleSlug: string | null
}

export default function AdminCommentsPage() {
  const { user, loading } = useProtectedRoute()
  const [comments, setComments] = useState<Comment[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchComments()
    }
  }, [user])

  async function fetchComments() {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/comments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setPageLoading(false)
    }
  }

  async function deleteComment(id: string) {
    if (!confirm("Hapus komentar ini?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== id))
      } else {
        const data = await response.json()
        alert(data.message || "Gagal menghapus komentar")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Terjadi kesalahan saat menghapus komentar")
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
            <h1 className="text-3xl font-bold">Komentar</h1>
            <p className="opacity-90 mt-1">{comments.length} komentar</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Belum ada komentar</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{comment.name}</h3>
                      <span className="text-sm text-muted-foreground">({comment.email})</span>
                    </div>
                    {comment.articleTitle && comment.articleSlug && (
                      <Link
                        href={`/article/${comment.articleSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2"
                      >
                        <span>{comment.articleTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDateFull(comment.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors ml-4"
                    title="Hapus komentar"
                  >
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

