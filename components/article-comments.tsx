"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDateFull } from "@/lib/date-utils"
import { MessageSquare, Send, Loader2 } from "lucide-react"

interface Comment {
  id: string
  name: string
  email: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ArticleCommentsProps {
  articleId: string
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  })

  // Fetch comments
  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comments?articleId=${articleId}`)
      const data = await response.json()
      
      if (response.ok) {
        setComments(data.comments || [])
      } else {
        setError(data.message || "Gagal memuat komentar")
      }
    } catch (err) {
      console.error("Error fetching comments:", err)
      setError("Gagal memuat komentar")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          articleId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: "", email: "", content: "" })
        // Refresh comments
        await fetchComments()
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || "Gagal mengirim komentar")
      }
    } catch (err) {
      console.error("Error submitting comment:", err)
      setError("Gagal mengirim komentar. Silakan coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">
          Komentar ({comments.length})
        </h2>
      </div>

      {/* Form Komentar */}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nama <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama Anda"
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="nama@email.com"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Komentar <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Tulis komentar Anda di sini..."
              rows={4}
              disabled={submitting}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.content.length}/1000 karakter
            </p>
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">
                Komentar berhasil dikirim!
              </p>
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full md:w-auto">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Komentar
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Daftar Komentar */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">Memuat komentar...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 border border-border rounded-lg bg-muted/30">
            <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{comment.name}</h3>
                  <p className="text-xs text-muted-foreground">{comment.email}</p>
                </div>
                <time className="text-xs text-muted-foreground">
                  {formatDateFull(comment.createdAt)}
                </time>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

