-- Script untuk menambahkan tabel Comment
-- Jalankan script ini di database Anda untuk menambahkan fitur komentar

-- Buat tabel Comment
CREATE TABLE IF NOT EXISTS "Comment" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"(id) ON DELETE CASCADE
);

-- Buat index untuk performa query
CREATE INDEX IF NOT EXISTS "Comment_articleId_idx" ON "Comment"("articleId");
CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt");

