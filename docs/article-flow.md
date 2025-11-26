# Skema Alur Penyimpanan Artikel

## Alur Penyimpanan Artikel ke Database

### 1. **Pembuatan Artikel (Create Article)**
- **Endpoint**: `POST /api/articles`
- **Lokasi**: `app/admin/articles/create/page.tsx`
- **Proses**:
  1. User mengisi form artikel (judul, kategori, excerpt, konten, gambar, status)
  2. Form di-submit melalui `handleSubmit()`
  3. Data dikirim ke API `/api/articles` dengan method POST
  4. API melakukan validasi dan autentikasi
  5. Artikel disimpan ke database dengan INSERT query

### 2. **Proses di Backend (API Route)**
- **File**: `app/api/articles/route.ts`
- **Fungsi POST**:
  ```typescript
  1. Verifikasi token admin
  2. Validasi data (title, content, categoryId wajib)
  3. Generate unique slug dari title
  4. Set publishedAt jika status = 'published'
  5. INSERT ke tabel "Article" dengan semua field
  ```

### 3. **Struktur Data yang Disimpan**
```sql
INSERT INTO "Article" (
  id,              -- UUID generated
  title,           -- Dari form
  slug,            -- Generated dari title (unique)
  content,         -- Dari form
  excerpt,         -- Dari form (optional)
  categoryId,      -- Dari form (required)
  authorId,        -- Dari JWT token
  featuredImage,   -- Base64 atau URL (optional)
  status,          -- 'draft' atau 'published'
  publishedAt      -- Date jika published, null jika draft
)
```

### 4. **Tampilan di Frontend**

#### **Homepage** (`app/page.tsx`)
- Mengambil artikel dengan status = 'published'
- Query: `SELECT ... WHERE a.status = 'published' ORDER BY publishedAt DESC LIMIT 6`
- Artikel muncul otomatis setelah dipublikasi

#### **Halaman Kategori** (`app/category/[slug]/page.tsx`)
- Mengambil artikel berdasarkan kategori slug
- Query: `SELECT ... WHERE c.slug = ${slug} AND a.status = 'published'`
- Artikel muncul otomatis di kategori yang sesuai

#### **Halaman Artikel** (`app/article/[slug]/page.tsx`)
- Mengambil artikel berdasarkan slug
- Query: `SELECT ... WHERE a.slug = ${slug} AND a.status = 'published'`
- Artikel dapat diakses melalui URL `/article/{slug}`

### 5. **Kondisi Artikel Muncul**

Artikel akan muncul di:
- ✅ **Homepage**: Jika `status = 'published'`
- ✅ **Halaman Kategori**: Jika `status = 'published'` dan `categoryId` sesuai
- ✅ **Halaman Artikel**: Jika `status = 'published'` dan slug sesuai
- ❌ **Tidak muncul**: Jika `status = 'draft'`

### 6. **Catatan Penting**

1. **Slug Unik**: Sistem otomatis memastikan slug unik dengan menambahkan counter jika perlu
2. **PublishedAt**: Otomatis di-set saat artikel dipublikasi
3. **Kategori**: Artikel harus memiliki kategori yang valid
4. **Gambar**: Dapat berupa base64 (upload) atau URL
5. **Status**: 
   - `draft`: Artikel tidak muncul di frontend
   - `published`: Artikel muncul di homepage dan kategori

## Troubleshooting

Jika artikel tidak muncul:
1. Pastikan status = 'published'
2. Pastikan kategori sudah ada di database
3. Pastikan publishedAt sudah di-set
4. Refresh halaman (Next.js mungkin cache)
5. Cek console untuk error

