import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Increment view count
    await sql`
      UPDATE "Article" 
      SET views = views + 1 
      WHERE slug = ${id} AND status = 'published'
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating view count:", error)
    return NextResponse.json({ message: "Error updating view count" }, { status: 500 })
  }
}
