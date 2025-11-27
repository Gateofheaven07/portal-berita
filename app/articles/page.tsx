import { sql } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatDate, formatDateShort } from "@/lib/date-utils"

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: string
  views: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  categoryId: string
  categoryName: string | null
  categorySlug: string | null
}

async function getAllPublishedArticles(): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.content,
        a.excerpt,
        a."featuredImage",
        a.status,
        a.views,
        a."createdAt",
        a."updatedAt",
        a."publishedAt",
        a."categoryId",
        c.name as "categoryName",
        c.slug as "categorySlug"
      FROM "Article" a
      LEFT JOIN "Category" c ON a."categoryId" = c.id
      WHERE a.status = 'published'
      ORDER BY a."publishedAt" DESC
    `
    
    // Convert to array and normalize data structure
    let articlesArray: any[] = []
    if (Array.isArray(result)) {
      articlesArray = result
    } else if (result && typeof result === 'object') {
      articlesArray = (result as any).rows || (result as any).data || [result]
    }
    
    return JSON.parse(JSON.stringify(articlesArray.map((article: any) => ({
      id: String(article?.id || ''),
      title: String(article?.title || ''),
      slug: String(article?.slug || ''),
      content: article?.content ? String(article.content) : '',
      excerpt: article?.excerpt ? String(article.excerpt) : null,
      featuredImage: article?.featuredImage ? String(article.featuredImage) : null,
      status: String(article?.status || ''),
      views: Number(article?.views || 0),
      createdAt: article?.createdAt ? new Date(article.createdAt).toISOString() : '',
      updatedAt: article?.updatedAt ? new Date(article.updatedAt).toISOString() : '',
      publishedAt: article?.publishedAt ? new Date(article.publishedAt).toISOString() : null,
      categoryId: String(article?.categoryId || ''),
      categoryName: article?.categoryName ? String(article.categoryName) : null,
      categorySlug: article?.categorySlug ? String(article.categorySlug) : null,
    }))))
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

export async function generateMetadata() {
  return {
    title: "Semua Artikel - Portal Berita Jabodetabek",
    description: "Jelajahi semua berita dan artikel terbaru dari Portal Berita Jabodetabek",
  }
}

export default async function AllArticlesPage() {
  const articles = await getAllPublishedArticles()

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Belum Ada Artikel</h1>
          <p className="text-muted-foreground mb-8">Belum ada artikel yang dipublikasi.</p>
          <Link href="/" className="text-primary hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="relative py-8 overflow-hidden" style={{ background: '#1E3A8A' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">Semua Artikel</h1>
          <p className="text-lg text-white/95 text-balance drop-shadow-md">
            Jelajahi semua berita dan artikel terbaru dari Portal Berita Jabodetabek
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          {articles.length > 0 && (
            <div className="mb-6 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <img
                    src={articles[0].featuredImage || "/placeholder.svg?key=featured1"}
                    alt={articles[0].title}
                    className="w-full h-32 md:h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-4 md:p-6 flex flex-col justify-center">
                  {articles[0].categoryName && articles[0].categorySlug && (
                    <Link
                      href={`/category/${articles[0].categorySlug}`}
                      className="inline-block w-fit px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2 hover:bg-primary/20 transition-colors"
                    >
                      {articles[0].categoryName}
                    </Link>
                  )}
                  <span className="inline-block w-fit px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                    Artikel Utama
                  </span>
                  <h2 className="text-lg md:text-xl font-bold mb-2 text-foreground line-clamp-2">{articles[0].title}</h2>
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {articles[0].excerpt || (articles[0].content ? articles[0].content.substring(0, 100) : "")}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDateShort(articles[0].publishedAt || articles[0].updatedAt)}
                    </span>
                    <Link
                      href={`/article/${articles[0].slug}`}
                      className="inline-flex items-center text-primary hover:opacity-80 transition-opacity font-medium text-sm"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {articles.length > 1 && (
            <>
              <h3 className="text-xl font-bold mb-4 text-foreground">Artikel Lainnya</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <article
                    key={article.id}
                    className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={article.featuredImage || "/placeholder.svg?key=article1"}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      {article.categoryName && article.categorySlug && (
                        <Link
                          href={`/category/${article.categorySlug}`}
                          className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded mb-2 hover:bg-primary/20 transition-colors"
                        >
                          {article.categoryName}
                        </Link>
                      )}
                      {article.publishedAt && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatDateShort(article.publishedAt)}
                        </p>
                      )}
                      <h3 className="text-lg font-bold mb-2 line-clamp-2 text-foreground">{article.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {article.excerpt || (article.content ? article.content.substring(0, 100) : "")}
                      </p>
                      <Link
                        href={`/article/${article.slug}`}
                        className="inline-flex items-center text-primary hover:opacity-80 transition-opacity font-medium text-sm"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

