import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, "..", ".env")

try {
  const envFile = readFileSync(envPath, "utf-8")
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (error) {
  console.warn("Warning: Could not read .env file:", error.message)
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set!")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  try {
    console.log("Starting migration: Adding ArticleImage table...")
    
    // Create ArticleImage table
    await sql`
      CREATE TABLE IF NOT EXISTS "ArticleImage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "url" TEXT NOT NULL,
        "caption" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "articleId" TEXT NOT NULL,
        CONSTRAINT "ArticleImage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `
    
    // Create index
    await sql`
      CREATE INDEX IF NOT EXISTS "ArticleImage_articleId_idx" ON "ArticleImage"("articleId");
    `

    console.log("✓ ArticleImage table created successfully!")
  } catch (error) {
    console.error("❌ Error during migration:", error)
    process.exit(1)
  }
}

migrate()

