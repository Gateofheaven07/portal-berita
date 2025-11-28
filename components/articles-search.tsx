"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, X } from "lucide-react"

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string | null
  categoryName: string | null
  categorySlug: string | null
}

interface ArticlesSearchProps {
  articles: Article[]
  onFilteredArticlesChange: (articles: Article[]) => void
}

export default function ArticlesSearch({ articles, onFilteredArticlesChange }: ArticlesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return articles
    }

    const query = searchQuery.toLowerCase().trim()
    return articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(query)
      const excerptMatch = article.excerpt?.toLowerCase().includes(query)
      const contentMatch = article.content.toLowerCase().includes(query)
      const categoryMatch = article.categoryName?.toLowerCase().includes(query)

      return titleMatch || excerptMatch || contentMatch || categoryMatch
    })
  }, [searchQuery, articles])

  // Update parent component when filtered articles change
  useEffect(() => {
    onFilteredArticlesChange(filteredArticles)
  }, [filteredArticles, onFilteredArticlesChange])

  const handleClear = () => {
    setSearchQuery("")
  }

  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari artikel berdasarkan judul, kategori, atau konten..."
          className="w-full pl-12 pr-10 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mt-2 text-sm text-muted-foreground">
          Ditemukan {filteredArticles.length} artikel dari {articles.length} total artikel
        </p>
      )}
    </div>
  )
}

