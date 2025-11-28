"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, Plus, Edit3, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

export default function AdminCategoriesPage() {
  const { user, loading } = useProtectedRoute()
  const { logout } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  // Helper function to validate and clean base64 image data
  const validateImageData = (data: any): string | null => {
    if (!data) return null
    
    let iconStr = String(data).trim()
    if (iconStr.length === 0) return null
    
    // Remove any potential BOM or invisible characters
    iconStr = iconStr.replace(/^\uFEFF/, '')
    
    // Remove any newlines or carriage returns that might have been added
    iconStr = iconStr.replace(/\r?\n/g, '')
    
    // Check if it's a valid data URL
    if (iconStr.startsWith('data:image/')) {
      // Validate base64 format - allow for flexible matching
      const base64Match = iconStr.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/s)
      if (base64Match && base64Match[2]) {
        let base64Data = base64Match[2]
        // Remove any whitespace that might have been introduced
        base64Data = base64Data.replace(/\s/g, '')
        // Reconstruct the data URL with cleaned base64
        const mimeType = base64Match[1] || 'png'
        return `data:image/${mimeType};base64,${base64Data}`
      }
      // If it starts with data:image/ but doesn't match, return as-is (might still work)
      return iconStr
    }
    
    // Check if it's a valid HTTP URL
    if (iconStr.startsWith('http://') || iconStr.startsWith('https://')) {
      return iconStr
    }
    
    return null
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        cache: 'no-store'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      const categoriesData = (data.categories || []).map((cat: any) => {
        return {
          id: String(cat.id || ''),
          name: String(cat.name || ''),
          slug: String(cat.slug || ''),
          description: cat.description ? String(cat.description) : null,
          icon: validateImageData(cat.icon),
        }
      })
      
      // Debug: Log categories with icons
      const categoriesWithIcons = categoriesData.filter((cat: Category) => cat.icon)
      if (categoriesWithIcons.length > 0) {
        console.log(`[Categories] Found ${categoriesWithIcons.length} categories with icons`)
        categoriesWithIcons.forEach((cat: Category) => {
          console.log(`  - ${cat.name}: icon length=${cat.icon?.length}, valid=${!!cat.icon}`)
        })
      }
      
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        setShowForm(false)
        setEditingCategory(null)
        setFormData({ name: "", description: "", icon: "" })
        setImagePreview(null)
        fetchCategories()
      } else {
        alert(data.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan")
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      alert("Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.")
      return
    }

    // Validasi ukuran file (max 2MB untuk icon)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar. Maksimal 2MB.")
      return
    }

    // Convert ke base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, icon: base64String })
      setImagePreview(base64String)
    }
    reader.onerror = () => {
      alert("Gagal membaca file gambar.")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, icon: "" })
    setImagePreview(null)
    if (typeof window !== "undefined") {
      const fileInput = document.getElementById("icon-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || "", icon: category.icon || "" })
    setImagePreview(category.icon || null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        fetchCategories()
      } else {
        alert(data.message || "Gagal menghapus kategori")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan")
    }
  }

  if (loading || isLoading) {
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
          <h1 className="text-3xl font-bold">Kelola Kategori</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Category Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingCategory(null)
              setFormData({ name: "", description: "", icon: "" })
              setImagePreview(null)
              setShowForm(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: '#1E3A8A' }}
          >
            <Plus className="w-4 h-4" />
            Tambah Kategori
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nama Kategori</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: Teknologi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Deskripsi (Opsional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Deskripsi kategori..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Icon Kategori (Opsional)</label>
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {imagePreview && (
                  <div className="mt-4 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview icon"
                      className="w-24 h-24 object-contain border border-border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Format yang didukung: JPG, PNG, WEBP, GIF, SVG (Maksimal 2MB)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Menyimpan..." : editingCategory ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                    setImagePreview(null)
                  }}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Daftar Kategori</h2>
          </div>
          <div className="divide-y divide-border">
            {categories.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Belum ada kategori. Tambahkan kategori pertama.
              </div>
            ) : (
              categories.map((category) => {
                // Use the same validation function
                const iconValue = validateImageData(category.icon)
                const hasIcon = !!iconValue
                
                // Debug logging
                if (hasIcon) {
                  console.log(`[Render] ${category.name}: Rendering icon, length=${iconValue.length}, type=${iconValue.substring(0, 20)}`)
                }
                
                return (
                <div key={category.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {hasIcon ? (
                        <div 
                          className="w-16 h-16 flex-shrink-0 border-2 border-blue-500 rounded-lg bg-white overflow-hidden flex items-center justify-center shadow-sm" 
                          style={{ 
                            minWidth: '64px', 
                            minHeight: '64px',
                            backgroundColor: '#ffffff'
                          }}
                          title={`Icon for ${category.name} (${iconValue.length} chars)`}
                        >
                          <img
                            src={iconValue}
                            alt={`Icon ${category.name}`}
                            className="w-full h-full object-contain"
                            style={{ 
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '4px'
                            }}
                            onError={(e) => {
                              console.error(`[${category.name}] Image failed to load:`, {
                                srcLength: iconValue.length,
                                srcPreview: iconValue.substring(0, 100)
                              })
                              const target = e.currentTarget
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent && !parent.querySelector('.icon-error')) {
                                const errorDiv = document.createElement('div')
                                errorDiv.className = 'icon-error w-full h-full flex items-center justify-center text-xs text-red-500 bg-red-50'
                                errorDiv.textContent = 'Error'
                                parent.appendChild(errorDiv)
                              }
                            }}
                            onLoad={(e) => {
                              console.log(`[${category.name}] Icon loaded successfully:`, {
                                naturalWidth: e.currentTarget.naturalWidth,
                                naturalHeight: e.currentTarget.naturalHeight
                              })
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-16 h-16 border-2 border-border rounded-lg flex-shrink-0 bg-muted flex items-center justify-center text-xs text-muted-foreground" 
                          style={{ minWidth: '64px', minHeight: '64px' }}
                        >
                          No Icon
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Slug: /{category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit kategori"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
