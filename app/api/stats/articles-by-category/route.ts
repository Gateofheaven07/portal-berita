import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get count of published articles per category
    const stats = await sql`
      SELECT 
        c.id,
        c.name,
        c.slug,
        COUNT(a.id) as count
      FROM "Category" c
      LEFT JOIN "Article" a ON c.id = a."categoryId" AND a.status = 'published'
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.name
    `

    // Transform data
    const categoryStats = stats.map((stat: any) => ({
      id: stat.id,
      name: stat.name,
      slug: stat.slug,
      count: Number(stat.count || 0),
    }))

    return NextResponse.json({ stats: categoryStats })
  } catch (error) {
    console.error("Error fetching article stats by category:", error)
    return NextResponse.json({ message: "Error fetching stats", stats: [] }, { status: 500 })
  }
}

