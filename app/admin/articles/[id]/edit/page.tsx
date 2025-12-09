"use client"

import type React from "react"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  categoryId: string
}

export default function EditArticle() {
  const { user, loading } = useProtectedRoute()
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [article, setArticle] = useState<Article | null>(null)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; caption: string }[]>([])
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [submitting, setSubmitting] = useState(false)
  const [loadingArticle, setLoadingArticle] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
    fetchArticle()
  }, [articleId])

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  async function fetchArticle() {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("Artikel tidak ditemukan")
        } else {
          setError("Gagal memuat artikel")
        }
        return
      }

      const data = await response.json()
      const articleData = data.article

      setArticle(articleData)
      setTitle(articleData.title || "")
      setExcerpt(articleData.excerpt || "")
      setContent(articleData.content || "")
      setCategoryId(articleData.categoryId || "")
      setFeaturedImage(articleData.featuredImage || "")
      setImagePreview(articleData.featuredImage || null)
      setStatus(articleData.status || "draft")
      setGalleryImages(articleData.images || [])
    } catch (error) {
      console.error("Error fetching article:", error)
      setError("Terjadi kesalahan saat memuat artikel")
    } finally {
      setLoadingArticle(false)
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.")
      return
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar terlalu besar. Maksimal 5MB.")
      return
    }

    // Convert ke base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFeaturedImage(base64String)
      setImagePreview(base64String)
      setError("")
    }
    reader.onerror = () => {
      setError("Gagal membaca file gambar.")
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setFeaturedImage("")
    setImagePreview(null)
    // Reset input file
    if (typeof window !== "undefined") {
      const fileInput = document.getElementById("image-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }
  }

  function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (galleryImages.length + files.length > 9) {
      setError("Maksimal 9 gambar tambahan (total 10 dengan gambar utama).")
      return
    }

    Array.from(files).forEach(file => {
      // Validasi tipe file
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) return

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) return

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setGalleryImages(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          url: base64String, 
          caption: "" 
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeGalleryImage(id: string) {
    setGalleryImages(prev => prev.filter(img => img.id !== id))
  }

  function updateGalleryCaption(id: string, caption: string) {
    setGalleryImages(prev => prev.map(img => 
      img.id === id ? { ...img, caption } : img
    ))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          categoryId,
          featuredImage,
          status,
          images: galleryImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Gagal memperbarui artikel"
        setError(errorMsg)
        console.error("Error response:", data)
        return
      }

      router.push("/admin/articles")
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat menyimpan artikel")
      console.error("Error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || loadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!article && !loadingArticle) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
            <Link href="/admin/articles" className="hover:bg-slate-100 rounded p-1 transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Edit Artikel</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error || "Artikel tidak ditemukan"}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/admin/articles" className="hover:bg-slate-100 rounded p-1 transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Artikel</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Judul Artikel
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul artikel"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Kategori
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
              Ringkasan Artikel
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Masukkan ringkasan singkat artikel"
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Featured Image Upload */}
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-foreground mb-2">
              Gambar Featured
            </label>
            <div className="space-y-4">
              {/* File Input */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="flex-1 px-4 py-2 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors text-center"
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm text-muted-foreground">
                    {imagePreview ? "Ganti Gambar" : "Pilih Gambar dari Perangkat"}
                  </span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg border border-input shadow-sm"
                  />
                </div>
              )}

              {/* URL Input (Alternatif) */}
              <div>
                <label htmlFor="image-url" className="block text-xs text-muted-foreground mb-1">
                  Atau masukkan URL gambar (opsional)
                </label>
                <input
                  id="image-url"
                  type="url"
                  value={featuredImage && !featuredImage.startsWith("data:") ? featuredImage : ""}
                  onChange={(e) => {
                    setFeaturedImage(e.target.value)
                    setImagePreview(e.target.value || null)
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Format yang didukung: JPG, PNG, WEBP, GIF (Maksimal 5MB)
            </p>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Galeri Gambar (Slider)
            </label>
            <p className="text-xs text-muted-foreground mb-4">
              Gambar ini akan ditampilkan sebagai slider. Maksimal 9 gambar tambahan.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, index) => (
                  <div key={img.id} className="relative group border rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={img.url} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(img.id)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Hapus</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Caption (opsional)"
                      value={img.caption || ""}
                      onChange={(e) => updateGalleryCaption(img.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border-t focus:outline-none"
                    />
                  </div>
                ))}
                
                {galleryImages.length < 9 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                    <span className="text-2xl text-muted-foreground">+</span>
                    <span className="text-xs text-muted-foreground mt-1">Tambah Gambar</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Konten Artikel
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan konten lengkap artikel"
              rows={12}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Dipublikasi</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? "Sedang Menyimpan..." : "Simpan Perubahan"}
            </button>
            <Link
              href="/admin/articles"
              className="flex-1 py-3 border border-border text-foreground rounded-lg font-semibold text-center hover:bg-accent/5 transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}

