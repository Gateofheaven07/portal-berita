import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Tentang Kami - J.comNews",
  description: "Tentang J.comNews - Portal Berita Jabodetabek",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Kembali ke Beranda
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-6 text-foreground">Tentang Kami</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Selamat Datang di J.comNews</h2>
            <p className="text-foreground mb-4">
              J.comNews adalah portal berita terpercaya yang berfokus pada penyediaan informasi terkini dan berkualitas 
              untuk wilayah Jabodetabek. Kami berkomitmen untuk menyajikan berita yang akurat, objektif, dan relevan 
              bagi masyarakat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Visi Kami</h2>
            <p className="text-foreground mb-4">
              Menjadi sumber informasi berita terdepan dan terpercaya di wilayah Jabodetabek, yang memberikan 
              kontribusi positif bagi masyarakat melalui jurnalisme yang berkualitas dan bertanggung jawab.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Misi Kami</h2>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Menyediakan berita terkini dan akurat untuk masyarakat Jabodetabek</li>
              <li>Mengutamakan objektivitas dan kredibilitas dalam setiap pemberitaan</li>
              <li>Memberikan informasi yang relevan dan bermanfaat bagi pembaca</li>
              <li>Mendukung transparansi dan akuntabilitas dalam pemberitaan</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Kategori Berita</h2>
            <p className="text-foreground mb-4">Kami menyediakan berbagai kategori berita untuk memenuhi kebutuhan informasi Anda:</p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li><strong>Berita Utama:</strong> Berita-berita penting dan terkini yang menjadi perhatian utama</li>
              <li><strong>Gaya Hidup:</strong> Informasi tentang tren, tips, dan inspirasi gaya hidup</li>
              <li><strong>Kesehatan:</strong> Berita kesehatan, tips medis, dan informasi kesehatan terkini</li>
              <li><strong>Politik & Hukum:</strong> Berita politik, hukum, dan kebijakan yang mempengaruhi masyarakat</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Komitmen Kami</h2>
            <p className="text-foreground mb-4">
              Kami berkomitmen untuk menjaga standar jurnalisme yang tinggi, menghormati privasi pembaca, 
              dan menyajikan informasi yang dapat dipertanggungjawabkan. Setiap artikel yang kami publikasikan 
              melalui proses verifikasi dan editing yang ketat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Hubungi Kami</h2>
            <p className="text-foreground mb-4">
              Kami senang mendengar dari Anda. Jika Anda memiliki pertanyaan, saran, atau ingin berkolaborasi, 
              silakan hubungi kami:
            </p>
            <div className="space-y-2 text-foreground">
              <p>
                <strong>Email:</strong> <a href="mailto:j.comnews@gmail.com" className="text-primary hover:underline">j.comnews@gmail.com</a>
              </p>
              <p>
                <strong>Telepon:</strong> <a href="tel:+621234567890" className="text-primary hover:underline">+62 (0) 123 456 7890</a>
              </p>
              <p>
                <strong>Alamat:</strong> Jakarta, Jabodetabek
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

