import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Syarat & Ketentuan - J.comNews",
  description: "Syarat dan ketentuan penggunaan J.comNews - Portal Berita Jabodetabek",
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-6 text-foreground">Syarat & Ketentuan</h1>
          <p className="text-muted-foreground mb-8">Terakhir diperbarui: 27 November 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Penerimaan Syarat</h2>
            <p className="text-foreground mb-4">
              Dengan mengakses dan menggunakan J.comNews, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. 
              Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan situs web kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">2. Penggunaan Situs</h2>
            <p className="text-foreground mb-4">Anda setuju untuk menggunakan situs kami hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar:</p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Hukum yang berlaku di Indonesia</li>
              <li>Hak-hak pihak ketiga</li>
              <li>Kebijakan dan pedoman yang ditetapkan oleh J.comNews</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Konten</h2>
            <p className="text-foreground mb-4">
              Semua konten di J.comNews, termasuk artikel, gambar, dan materi lainnya, dilindungi oleh hak cipta 
              dan merupakan milik J.comNews atau pemberi lisensinya. Anda tidak boleh menyalin, memodifikasi, atau 
              mendistribusikan konten tanpa izin tertulis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">4. Akurasi Informasi</h2>
            <p className="text-foreground mb-4">
              Kami berusaha untuk menyediakan informasi yang akurat dan terkini. Namun, kami tidak menjamin 
              keakuratan, kelengkapan, atau ketepatan waktu dari informasi yang disajikan. Penggunaan informasi 
              di situs ini adalah risiko Anda sendiri.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Tautan ke Situs Lain</h2>
            <p className="text-foreground mb-4">
              Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas 
              konten, kebijakan privasi, atau praktik situs web pihak ketiga tersebut.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Batasan Tanggung Jawab</h2>
            <p className="text-foreground mb-4">
              J.comNews tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial 
              yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan situs web kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">7. Perubahan Syarat</h2>
            <p className="text-foreground mb-4">
              Kami berhak mengubah Syarat & Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. 
              Perubahan akan berlaku efektif setelah dipublikasikan di halaman ini.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">8. Hukum yang Berlaku</h2>
            <p className="text-foreground mb-4">
              Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
              Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">9. Hubungi Kami</h2>
            <p className="text-foreground mb-4">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
            </p>
            <p className="text-foreground">
              Email: <a href="mailto:j.comnews@gmail.com" className="text-primary hover:underline">j.comnews@gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}

