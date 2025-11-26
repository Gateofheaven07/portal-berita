"use client"

import type React from "react"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Trash2, ChevronLeft } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  image: string
  description: string
}

export default function AdminGalleryPage() {
  const { user, loading } = useProtectedRoute()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchGallery()
    }
  }, [user])

  async function fetchGallery() {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setGallery(data.gallery || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
    }
  }

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image, description }),
      })

      if (response.ok) {
        setTitle("")
        setImage("")
        setDescription("")
        fetchGallery()
      }
    } catch (error) {
      console.error("Error adding image:", error)
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Hapus gambar ini?")) return

    try {
      const token = localStorage.getItem("authToken")
      await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchGallery()
    } catch (error) {
      console.error("Error deleting image:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/admin/dashboard" className="hover:opacity-80">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Kelola Galeri</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Image Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-foreground">Tambah Gambar Baru</h2>
          <form onSubmit={handleAddImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Judul</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL Gambar</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {submitting ? "Menambah..." : "Tambah Gambar"}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                )}
                <button
                  onClick={() => deleteImage(item.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
