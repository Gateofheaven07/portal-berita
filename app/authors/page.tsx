"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, User } from "lucide-react"

interface Author {
  id: string
  name: string
  email: string
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthors()
  }, [])

  async function fetchAuthors() {
    try {
      const response = await fetch("/api/authors")
      const data = await response.json()
      setAuthors(data.authors || [])
    } catch (error) {
      console.error("Error fetching authors:", error)
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
            <h1 className="text-4xl font-bold">Profil Penulis</h1>
          </div>
          <p className="text-xl opacity-90">Tim profesional di balik Portal Berita Jabodetabek</p>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : authors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada penulis</p>
              <Link href="/" className="text-primary hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{author.name}</h3>
                  <p className="text-sm text-muted-foreground">{author.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
