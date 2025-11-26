import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Token tidak ditemukan" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    return NextResponse.json({ user: decoded })
  } catch (error) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 })
  }
}
