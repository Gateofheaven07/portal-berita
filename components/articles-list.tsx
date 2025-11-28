"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatDateShort } from "@/lib/date-utils"
import ArticlesSearch from "./articles-search"

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  publishedAt: string | null
  categoryName: string | null
  categorySlug: string | null
}

interface ArticlesListProps {
  articles: Article[]
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-8">Belum ada artikel yang dipublikasi.</p>
        <Link href="/" className="text-primary hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Search Bar */}
      <ArticlesSearch articles={articles} onFilteredArticlesChange={setFilteredArticles} />

      {/* Featured Article */}
      {filteredArticles.length > 0 && (
        <div className="mb-6 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <img
                src={filteredArticles[0].featuredImage || "/placeholder.svg?key=featured1"}
                alt={filteredArticles[0].title}
                className="w-full h-32 md:h-full object-cover"
              />
            </div>
            <div className="md:col-span-2 p-4 md:p-6 flex flex-col justify-center">
              {filteredArticles[0].categoryName && filteredArticles[0].categorySlug && (
                <Link
                  href={`/category/${filteredArticles[0].categorySlug}`}
                  className="inline-block w-fit px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2 hover:bg-primary/20 transition-colors"
                >
                  {filteredArticles[0].categoryName}
                </Link>
              )}
              <span className="inline-block w-fit px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                Artikel Utama
              </span>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-foreground line-clamp-2">{filteredArticles[0].title}</h2>
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {filteredArticles[0].excerpt || (filteredArticles[0].content ? filteredArticles[0].content.substring(0, 100) : "")}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDateShort(filteredArticles[0].publishedAt || "")}
                </span>
                <Link
                  href={`/article/${filteredArticles[0].slug}`}
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
      {filteredArticles.length > 1 ? (
        <>
          <h3 className="text-xl font-bold mb-4 text-foreground">Artikel Lainnya</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(1).map((article) => (
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
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Tidak ada artikel yang sesuai dengan pencarian Anda</p>
          <p className="text-sm text-muted-foreground">Coba gunakan kata kunci yang berbeda</p>
        </div>
      ) : null}
    </>
  )
}

