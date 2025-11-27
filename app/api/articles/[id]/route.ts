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

async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  // Check if slug exists (excluding current article if updating)
  while (true) {
    let existing
    if (excludeId) {
      existing = await sql`
        SELECT id FROM "Article" WHERE slug = ${slug} AND id != ${excludeId} LIMIT 1
      `
    } else {
      existing = await sql`
        SELECT id FROM "Article" WHERE slug = ${slug} LIMIT 1
      `
    }
    
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

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
        c.name as "categoryName"
      FROM "Article" a
      LEFT JOIN "Category" c ON a."categoryId" = c.id
      WHERE a.id = ${id}
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    const article = result[0]
    return NextResponse.json({ article })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ message: "Error fetching article" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { title, excerpt, content, categoryId, featuredImage, status } = await req.json()

    if (!title || !content || !categoryId) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 })
    }

    // Check if article exists
    const existing = await sql`
      SELECT id, title, slug, status, "publishedAt" FROM "Article" WHERE id = ${id} LIMIT 1
    `

    if (existing.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    // Generate new slug if title changed
    const existingArticle = existing[0]
    let slug = existingArticle.slug
    if (title !== existingArticle.title) {
      const baseSlug = generateSlug(title)
      slug = await generateUniqueSlug(baseSlug, id)
    }

    // Handle publishedAt: set if changing from draft to published, keep existing if already published
    // Use Indonesia timezone to ensure correct date
    let publishedAt = existingArticle.publishedAt
    if (status === "published" && existingArticle.status === "draft") {
      publishedAt = getIndonesiaDate()
    } else if (status === "draft" && existingArticle.status === "published") {
      // Keep publishedAt even if changed to draft (for history)
      publishedAt = existingArticle.publishedAt
    }

    await sql`
      UPDATE "Article"
      SET 
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt || null},
        "categoryId" = ${categoryId},
        "featuredImage" = ${featuredImage || null},
        status = ${status},
        "publishedAt" = ${publishedAt},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Article updated" })
  } catch (error: any) {
    console.error("Error updating article:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error updating article"
      : "Error updating article"
    return NextResponse.json({ 
      message: errorMessage,
      error: error?.message,
      details: process.env.NODE_ENV === "development" ? error?.stack : undefined
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    await sql`DELETE FROM "Article" WHERE id = ${id}`

    return NextResponse.json({ message: "Article deleted" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ message: "Error deleting article" }, { status: 500 })
  }
}
