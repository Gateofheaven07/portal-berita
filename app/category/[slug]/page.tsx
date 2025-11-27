import { sql } from "@/lib/db"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatDate, formatDateShort } from "@/lib/date-utils"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

interface CategoryArticle {
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
  categoryName: string
  categoryDescription: string | null
}

async function getCategoryArticles(slug: string): Promise<CategoryArticle[]> {
  try {
    const result = await sql`
      SELECT a.*, c.name as "categoryName", c.description as "categoryDescription"
      FROM "Article" a
      JOIN "Category" c ON a."categoryId" = c.id
      WHERE c.slug = ${slug} AND a.status = 'published'
      ORDER BY a."publishedAt" DESC
    ` as CategoryArticle[]
    return result
  } catch (error) {
    console.error("Error fetching articles:", error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const articles = await getCategoryArticles(slug)
  const categoryName = articles[0]?.categoryName || "Kategori"

  return {
    title: `${categoryName} - Portal Berita Jabodetabek`,
    description: `Baca berita ${categoryName} terbaru dari Jabodetabek`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const articles = await getCategoryArticles(slug)

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Kategori Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">Belum ada artikel dalam kategori ini.</p>
          <Link href="/" className="text-primary hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const category = articles[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-cyan-500 via-blue-500 to-purple-400 py-8 overflow-hidden">
        {/* Decorative overlay for depth and smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-cyan-300/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">{category.categoryName}</h1>
          <p className="text-lg text-white/95 text-balance drop-shadow-md">
            {category.categoryDescription || "Jelajahi berita dan artikel terbaru dalam kategori ini"}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Article */}
          {articles.length > 0 && (
            <div className="mb-4 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <img
                    src={articles[0].featuredImage || "/placeholder.svg?key=featured1"}
                    alt={articles[0].title}
                    className="w-full h-32 md:h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-3 flex flex-col justify-center">
                  <span className="inline-block w-fit px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-1">
                    Artikel Utama
                  </span>
                  <h2 className="text-base md:text-lg font-bold mb-1 text-foreground line-clamp-2">{articles[0].title}</h2>
                  <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">
                    {articles[0].excerpt || (articles[0].content ? articles[0].content.substring(0, 80) : "")}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(articles[0].publishedAt || articles[0].updatedAt)}
                    </span>
                    <Link
                      href={`/article/${articles[0].slug}`}
                      className="inline-flex items-center text-primary hover:opacity-80 transition-opacity font-medium text-xs"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {articles.length > 1 && (
            <>
              <h3 className="text-base font-bold mb-3 text-foreground">Artikel Lainnya</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {articles.slice(1).map((article) => (
                  <article
                    key={article.id}
                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={article.featuredImage || "/placeholder.svg?key=article1"}
                      alt={article.title}
                      className="w-full h-20 object-cover"
                    />
                    <div className="p-2">
                      <span className="inline-block px-1 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-1">
                        {category.categoryName}
                      </span>
                      <h3 className="text-xs font-bold mb-1 line-clamp-2 text-foreground leading-tight">{article.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                        {article.excerpt || (article.content ? article.content.substring(0, 40) : "")}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatDateShort(article.publishedAt || article.updatedAt)}
                        </span>
                        <Link
                          href={`/article/${article.slug}`}
                          className="text-primary hover:opacity-80 transition-opacity font-medium"
                        >
                          →
                        </Link>
                      </div>
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
