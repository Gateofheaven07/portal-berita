"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Edit2, Trash2, Eye, Plus, ChevronLeft } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  category: { name: string } | null
  status: string
  views: number
  publishedAt: string | null
  updatedAt: string
}

export default function ArticlesPage() {
  const { user, loading } = useProtectedRoute()
  const [articles, setArticles] = useState<Article[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")

  useEffect(() => {
    fetchArticles()
  }, [filter])

  async function fetchArticles() {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/articles?status=${filter === "all" ? "" : filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setPageLoading(false)
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== id))
      }
    } catch (error) {
      console.error("Error deleting article:", error)
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
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="hover:bg-slate-100 rounded p-1 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Kelola Artikel</h1>
          </div>
          <Link
            href="/admin/articles/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Artikel Baru
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-opacity ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-card border border-border text-foreground hover:bg-accent/10"
              }`}
            >
              {status === "all" ? "Semua" : status === "published" ? "Dipublikasi" : "Draft"}
            </button>
          ))}
        </div>

        {/* Articles Table */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada artikel</p>
            <Link href="/admin/articles/create" className="text-primary hover:underline">
              Buat artikel pertama Anda
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Judul</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-accent/5">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {article.category?.name || "Tidak ada kategori"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {article.status === "published" ? "Dipublikasi" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-foreground flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-2 hover:bg-primary/10 rounded transition-colors"
                        >
                          <Edit2 className="w-5 h-5 text-primary" />
                        </Link>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="p-2 hover:bg-destructive/10 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
