"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface GalleryImage {
  id: string
  title: string
  image: string
  description: string
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    try {
      const response = await fetch("/api/gallery")
      const data = await response.json()
      setGallery(data.gallery || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="text-white py-12" style={{ background: '#1E3A8A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="hover:opacity-80">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold">Galeri Foto</h1>
          </div>
          <p className="text-xl opacity-90">Koleksi foto dan visual dari berbagai peristiwa dan momen di Jabodetabek</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Galeri belum tersedia</p>
              <Link href="/" className="text-primary hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-2 line-clamp-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
