import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const authors = await sql`
      SELECT id, name, email FROM "User" WHERE role = 'admin'
    `

    return NextResponse.json({ authors })
  } catch (error) {
    console.error("Error fetching authors:", error)
    return NextResponse.json({ message: "Error fetching authors", authors: [] }, { status: 500 })
  }
}
