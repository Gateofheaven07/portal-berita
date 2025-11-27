"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { formatDateShort } from "@/lib/date-utils"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  categoryName: string
  categorySlug: string
  publishedAt: string
  views: number
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchCategories()
    const urlParams = new URLSearchParams(window.location.search)
    const q = urlParams.get("q")
    if (q) {
      setQuery(q)
      handleSearch(q, "")
    }
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  async function handleSearch(searchQuery: string = query, categoryFilter: string = selectedCategory) {
    if (!searchQuery.trim()) {
      setArticles([])
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(categoryFilter && { categoryId: categoryFilter }),
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error searching:", error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCategoryChange(categoryId: string) {
    setSelectedCategory(categoryId)
    handleSearch(query, categoryId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Cari Artikel</h1>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
              placeholder="Cari berita, artikel, atau topik..."
              className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-2.5 px-4 py-1.5 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-3 items-center">
            <Filter className="w-5 h-5 text-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          {!hasSearched ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">Gunakan search bar di atas untuk mencari artikel</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Sedang mencari...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">Tidak ada artikel yang sesuai dengan pencarian Anda</p>
              <Link href="/" className="text-primary hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-6">Ditemukan {articles.length} artikel</p>
              <div className="space-y-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/article/${article.slug}`} className="block group">
                    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage || "/placeholder.svg"}
                            alt={article.title}
                            className="hidden md:block w-40 h-32 object-cover rounded group-hover:scale-105 transition-transform"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                              {article.categoryName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateShort(article.publishedAt)}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-2">{article.excerpt || article.title}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
