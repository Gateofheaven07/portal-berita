import { sql } from "@/lib/db"
import Link from "next/link"
import { ChevronLeft, Clock, User, Eye } from "lucide-react"
import { formatDate, formatDateShort } from "@/lib/date-utils"
import { ViewTracker } from "@/components/view-tracker"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

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
  categoryName: string
  categorySlug: string
  authorName: string
  images: { url: string; caption: string | null }[]
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const result = await sql`
      SELECT a.*, c.name as "categoryName", c.slug as "categorySlug", u.name as "authorName"
      FROM "Article" a
      JOIN "Category" c ON a."categoryId" = c.id
      JOIN "User" u ON a."authorId" = u.id
      WHERE a.slug = ${slug} AND a.status = 'published'
    ` as any[]
    
    if (result.length === 0) return null

    const article = result[0]
    
    // Fetch additional images
    const images = await sql`
      SELECT url, caption
      FROM "ArticleImage"
      WHERE "articleId" = ${article.id}
      ORDER BY "order" ASC
    ` as { url: string; caption: string | null }[]

    return { ...article, images }
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

async function getRelatedArticles(categoryId: string, currentSlug: string): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT a.*, c.name as "categoryName"
      FROM "Article" a
      JOIN "Category" c ON a."categoryId" = c.id
      WHERE a."categoryId" = ${categoryId} 
      AND a.slug != ${currentSlug}
      AND a.status = 'published'
      ORDER BY a."createdAt" DESC
      LIMIT 3
    ` as Article[]
    return result
  } catch (error) {
    console.error("Error fetching related articles:", error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    }
  }

  return {
    title: `${article.title} - Portal Berita Jabodetabek`,
    description: article.excerpt || article.content.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      image: article.featuredImage,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">Artikel yang Anda cari tidak ada atau telah dihapus.</p>
          <Link href="/" className="text-primary hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, slug)

  return (
    <div className="min-h-screen bg-background">
      <ViewTracker slug={slug} />
      {/* Article Header - Mobile Optimized */}
      <article className="bg-card">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link href={`/category/${article.categorySlug}`} className="hover:text-primary transition-colors">
              {article.categoryName}
            </Link>
          </div>

          {/* Category Badge */}
          {article.categoryName && (
            <div className="mb-4">
              <Link
                href={`/category/${article.categorySlug}`}
                className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                {article.categoryName}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight">{article.title}</h1>

          {/* Meta Info - Compact */}
          <div className="text-sm text-muted-foreground mb-6">
            <span>Published by </span>
            <span className="font-medium text-primary">{article.authorName}</span>
            <span> on </span>
            <span className="font-medium text-foreground">
              {formatDate(article.publishedAt || article.updatedAt, "en-US")}
            </span>
          </div>

          {/* Featured Image or Carousel */}
          {(() => {
            const allImages = [
              article.featuredImage ? { url: article.featuredImage, caption: null, isFeatured: true } : null,
              ...(article.images || []).map(img => ({ url: img.url, caption: img.caption, isFeatured: false }))
            ].filter((img): img is { url: string; caption: string | null; isFeatured: boolean } => !!img)

            if (allImages.length > 1) {
              return (
                <div className="mb-6">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {allImages.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <img
                              src={img.url}
                              alt={img.caption || article.title}
                              className="w-full h-64 md:h-80 object-cover rounded-lg"
                            />
                            <div className="text-center mt-2">
                              <span className="text-sm text-muted-foreground italic">
                                {img.caption || (img.isFeatured ? `(Gambar - ${article.title})` : "")}
                              </span>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
              )
            }

            // Single Image Fallback
            if (article.featuredImage) {
              return (
                <div className="mb-6">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                  <div className="text-center mt-2">
                    <span className="text-sm text-muted-foreground italic">
                      (Gambar - {article.title})
                    </span>
                  </div>
                </div>
              )
            }
            
            return null
          })()}
        </div>
      </article>

      {/* Article Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Excerpt */}
        {article.excerpt && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
            <p className="text-base text-muted-foreground italic leading-relaxed">{article.excerpt}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-gray max-w-none">
          {article.content?.split("\n\n").filter((p: string) => p.trim()).map((paragraph: string, index: number) => (
            <p key={index} className="text-base leading-relaxed mb-5 text-foreground text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Article Stats */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString("id-ID")} pembaca</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {formatDateShort(article.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/30 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 text-foreground">Artikel Terkait</h2>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/article/${related.slug}`} className="block group">
                  <div className="bg-card rounded-lg p-4 hover:shadow-md transition-shadow border border-border/50">
                    <div className="flex gap-4">
                      {related.featuredImage && (
                        <img
                          src={related.featuredImage || "/placeholder.svg?key=related1"}
                          alt={related.title}
                          className="w-20 h-16 object-cover rounded flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                          {related.categoryName}
                        </span>
                        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm leading-tight">
                          {related.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:opacity-80 transition-opacity text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Beranda
          </Link>
          <Link
            href={`/category/${article.categorySlug}`}
            className="inline-flex items-center text-primary hover:opacity-80 transition-opacity text-sm font-medium"
          >
            {article.categoryName}
            <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}
