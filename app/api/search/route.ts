import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const categoryId = searchParams.get("categoryId")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ articles: [] })
    }

    const searchTerm = `%${query}%`

    let result

    if (categoryId) {
      result = await sql`
        SELECT a.*, c.name as "categoryName", c.slug as "categorySlug"
        FROM "Article" a
        JOIN "Category" c ON a."categoryId" = c.id
        WHERE a.status = 'published'
        AND a."categoryId" = ${categoryId}
        AND (
          a.title ILIKE ${searchTerm}
          OR a.excerpt ILIKE ${searchTerm}
          OR a.content ILIKE ${searchTerm}
        )
        ORDER BY a."publishedAt" DESC
        LIMIT 20
      `
    } else {
      result = await sql`
        SELECT a.*, c.name as "categoryName", c.slug as "categorySlug"
        FROM "Article" a
        JOIN "Category" c ON a."categoryId" = c.id
        WHERE a.status = 'published'
        AND (
          a.title ILIKE ${searchTerm}
          OR a.excerpt ILIKE ${searchTerm}
          OR a.content ILIKE ${searchTerm}
        )
        ORDER BY a."publishedAt" DESC
        LIMIT 20
      `
    }

    return NextResponse.json({ articles: result })
  } catch (error) {
    console.error("Error searching articles:", error)
    return NextResponse.json({ message: "Error searching articles", articles: [] }, { status: 500 })
  }
}
