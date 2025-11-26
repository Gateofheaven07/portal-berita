import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const id = require("crypto").randomUUID()

    await sql`
      INSERT INTO "ContactMessage" (id, name, email, subject, message)
      VALUES (${id}, ${name}, ${email}, ${subject}, ${message})
    `

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 })
  } catch (error: any) {
    console.error("Error sending message:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error sending message"
      : "Error sending message"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
