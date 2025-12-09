import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getIndonesiaDate } from "@/lib/date-utils"

function verifyToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
  } catch {
    return null
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  // Check if slug exists
  while (true) {
    const existing = await sql`
      SELECT id FROM "Article" WHERE slug = ${slug} LIMIT 1
    `
    
    if (existing.length === 0) {
      return slug
    }
    
    // If slug exists, append counter
    slug = `${baseSlug}-${counter}`
    counter++
    
    // Safety check to prevent infinite loop
    if (counter > 1000) {
      // Fallback: add timestamp
      slug = `${baseSlug}-${Date.now()}`
      break
    }
  }
  
  return slug
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")

    // Use parameterized query to prevent SQL injection
    let articles
    if (status && categoryId) {
      articles = await sql`
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
          c.id as "categoryId",
          c.name as "categoryName"
        FROM "Article" a
        LEFT JOIN "Category" c ON a."categoryId" = c.id
        WHERE a.status = ${status} AND a."categoryId" = ${categoryId}
        ORDER BY a."publishedAt" DESC NULLS LAST
      `
    } else if (status) {
      articles = await sql`
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
          c.id as "categoryId",
          c.name as "categoryName"
        FROM "Article" a
        LEFT JOIN "Category" c ON a."categoryId" = c.id
        WHERE a.status = ${status}
        ORDER BY a."publishedAt" DESC NULLS LAST
      `
    } else if (categoryId) {
      articles = await sql`
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
          c.id as "categoryId",
          c.name as "categoryName"
        FROM "Article" a
        LEFT JOIN "Category" c ON a."categoryId" = c.id
        WHERE a."categoryId" = ${categoryId}
        ORDER BY a."publishedAt" DESC NULLS LAST
      `
    } else {
      // Default: get all articles (for admin panel)
      articles = await sql`
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
          c.id as "categoryId",
          c.name as "categoryName"
        FROM "Article" a
        LEFT JOIN "Category" c ON a."categoryId" = c.id
        ORDER BY a."publishedAt" DESC NULLS LAST
      `
    }

    // Transform data to match expected format
    const transformedArticles = articles.map((article: any) => ({
      ...article,
      category: article.categoryName ? { name: article.categoryName } : null,
    }))

    return NextResponse.json({ articles: transformedArticles })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ message: "Error fetching articles" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, excerpt, content, categoryId, featuredImage, status, images } = await req.json()

    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 })
    }

    const id = require("crypto").randomUUID()
    const baseSlug = generateSlug(title)
    const slug = await generateUniqueSlug(baseSlug)
    const authorId = (decoded as any).id

    // Set publishedAt if status is published (use null for draft)
    // Use Indonesia timezone to ensure correct date
    const publishedAt = status === "published" ? getIndonesiaDate() : null

    await sql`
      INSERT INTO "Article" (id, title, slug, content, excerpt, "categoryId", "authorId", "featuredImage", status, "publishedAt")
      VALUES (${id}, ${title}, ${slug}, ${content}, ${excerpt || null}, ${categoryId}, ${authorId}, ${featuredImage || null}, ${status}, ${publishedAt})
    `

    // Insert images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (const [index, img] of images.entries()) {
        if (img.url) {
          const imageId = require("crypto").randomUUID()
          await sql`
            INSERT INTO "ArticleImage" (id, url, caption, "order", "articleId")
            VALUES (${imageId}, ${img.url}, ${img.caption || null}, ${index}, ${id})
          `
        }
      }
    }

    return NextResponse.json({ message: "Article created", id }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating article:", error)
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error creating article"
      : "Error creating article"
    return NextResponse.json({ 
      message: errorMessage,
      error: error?.message,
      details: process.env.NODE_ENV === "development" ? error?.stack : undefined
    }, { status: 500 })
  }
}
