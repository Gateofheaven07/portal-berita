import { sql } from "@/lib/db"
import Link from "next/link"
import ArticlesList from "@/components/articles-list"

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
          <ArticlesList articles={articles} />
        </div>
      </section>
    </div>
  )
}

