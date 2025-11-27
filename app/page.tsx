import { sql } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search } from "lucide-react"
import { formatDateShort } from "@/lib/date-utils"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  publishedAt: string | null
  categoryName: string | null
  categorySlug: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

async function getLatestArticles() {
  try {
    const result = await sql`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content,
        a."featuredImage",
        a."publishedAt",
        c.name as "categoryName",
        c.slug as "categorySlug"
      FROM "Article" a
      LEFT JOIN "Category" c ON a."categoryId" = c.id
      WHERE a.status = 'published'
      ORDER BY a."publishedAt" DESC
      LIMIT 6
    `
    // Convert to array and normalize data structure
    // Handle different return types from neon()
    let articlesArray: any[] = []
    if (Array.isArray(result)) {
      articlesArray = result
    } else if (result && typeof result === 'object') {
      // If result is an object with rows property (some neon versions)
      articlesArray = (result as any).rows || (result as any).data || [result]
    }
    
    // Normalize data to ensure consistent structure and prevent hydration errors
    // Use JSON.parse(JSON.stringify()) to ensure serializable data
    return JSON.parse(JSON.stringify(articlesArray.map((article: any) => ({
      id: String(article?.id || ''),
      title: String(article?.title || ''),
      slug: String(article?.slug || ''),
      excerpt: article?.excerpt ? String(article.excerpt) : null,
      content: article?.content ? String(article.content) : '',
      featuredImage: article?.featuredImage ? String(article.featuredImage) : null,
      publishedAt: article?.publishedAt ? new Date(article.publishedAt).toISOString() : null,
      categoryName: article?.categoryName ? String(article.categoryName) : null,
      categorySlug: article?.categorySlug ? String(article.categorySlug) : null,
    }))))
  } catch (error) {
    console.error("Error fetching latest articles:", error)
    return []
  }
}

async function getCategoriesFromDb() {
  try {
    const result = await sql`
      SELECT id, name, slug, description
      FROM "Category"
      ORDER BY name
    `
    // Convert to array and normalize data structure
    // Handle different return types from neon()
    let categoriesArray: any[] = []
    if (Array.isArray(result)) {
      categoriesArray = result
    } else if (result && typeof result === 'object') {
      // If result is an object with rows property (some neon versions)
      categoriesArray = (result as any).rows || (result as any).data || [result]
    }
    
    // Normalize data to ensure consistent structure and prevent hydration errors
    // Use JSON.parse(JSON.stringify()) to ensure serializable data
    return JSON.parse(JSON.stringify(categoriesArray.map((cat: any) => ({
      id: String(cat?.id || ''),
      name: String(cat?.name || ''),
      slug: String(cat?.slug || ''),
      description: cat?.description ? String(cat.description) : null,
    }))))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function Home() {
  const latestNews = await getLatestArticles()
  const categoriesData = await getCategoriesFromDb()

  // Map categories to display format
  const categoryMap: Record<string, { icon: string; color: string; useImage?: boolean }> = {
    "Berita Utama": { icon: "📰", color: "bg-blue-50 dark:bg-blue-950" },
    "Gaya Hidup": { icon: "✨", color: "bg-pink-50 dark:bg-pink-950" },
    "Kesehatan": { icon: "/logo_kesehatan.png", color: "bg-green-50 dark:bg-green-950", useImage: true },
    "Politik dan Hukum": { icon: "⚖️", color: "bg-purple-50 dark:bg-purple-950" },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-cyan-500 via-blue-500 to-purple-400 py-16 md:py-24 overflow-hidden">
        {/* Decorative overlay for depth and smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-cyan-300/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white drop-shadow-lg">Portal Berita Jabodetabek</h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 text-balance drop-shadow-md">
              Sumber Informasi Terpercaya dan Terkini untuk Jabodetabek
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Mulai Jelajahi
            </Link>
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Berita Terbaru</h2>
          {latestNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada artikel yang dipublikasi</p>
              <p className="text-sm text-muted-foreground">Artikel akan muncul di sini setelah dipublikasi</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news: Article) => (
                <article
                  key={news.id}
                  className="bg-background rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={news.featuredImage || "/placeholder.svg"}
                    alt={news.title || "Artikel"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    {news.categoryName && news.categorySlug && (
                      <Link
                        href={`/category/${news.categorySlug}`}
                        className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded mb-3 hover:bg-primary/20 transition-colors"
                      >
                        {news.categoryName}
                      </Link>
                    )}
                    {news.publishedAt && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDateShort(news.publishedAt)}
                      </p>
                    )}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {news.excerpt || (news.content ? String(news.content).substring(0, 150) : "")}
                    </p>
                    <Link
                      href={`/article/${news.slug}`}
                      className="inline-flex items-center text-primary hover:opacity-80 transition-opacity font-medium"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Lihat Lebih Banyak Link */}
          {latestNews.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Lihat Lebih Banyak
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Jelajahi Kategori</h2>
          {categoriesData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada kategori tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoriesData.map((cat: Category) => {
                const categoryInfo = categoryMap[cat.name] || { icon: "📄", color: "bg-slate-50 dark:bg-slate-950" }
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`p-4 rounded-lg ${categoryInfo.color} hover:shadow-lg transition-shadow group`}
                  >
                    <div className="text-3xl mb-2">
                      {categoryInfo.useImage ? (
                        <Image
                          src={categoryInfo.icon}
                          alt={cat.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        categoryInfo.icon
                      )}
                    </div>
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cat.description || "Jelajahi artikel dalam kategori ini"}</p>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-blue-500 via-cyan-500 via-blue-600 to-purple-400 overflow-hidden">
        {/* Decorative overlay for depth and smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-300/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-lg">Tetap Terupdate Dengan Berita Terbaru</h2>
          <p className="text-xl text-white/95 mb-8">Jangan lewatkan informasi penting dan terkini dari Jabodetabek</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </div>
  )
}
