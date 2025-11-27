import Link from "next/link"
import { ChevronLeft, CheckCircle, Globe, FileText, AlertCircle, ExternalLink, Scale, RefreshCw, Gavel, Mail } from "lucide-react"

export const metadata = {
  title: "Syarat & Ketentuan - J.comNews",
  description: "Syarat dan ketentuan penggunaan J.comNews - Portal Berita Jabodetabek",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="text-white py-12" style={{ background: '#1E3A8A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Syarat & Ketentuan</h1>
          <p className="text-xl text-white/90">Terakhir diperbarui: 27 November 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-none">

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">1. Penerimaan Syarat</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Dengan mengakses dan menggunakan J.comNews, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini. 
                Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak boleh menggunakan situs web kami.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">2. Penggunaan Situs</h2>
              </div>
              <p className="text-foreground mb-4">Anda setuju untuk menggunakan situs kami hanya untuk tujuan yang sah dan dengan cara yang tidak melanggar:</p>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                <li>Hukum yang berlaku di Indonesia</li>
                <li>Hak-hak pihak ketiga</li>
                <li>Kebijakan dan pedoman yang ditetapkan oleh J.comNews</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">3. Konten</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Semua konten di J.comNews, termasuk artikel, gambar, dan materi lainnya, dilindungi oleh hak cipta 
                dan merupakan milik J.comNews atau pemberi lisensinya. Anda tidak boleh menyalin, memodifikasi, atau 
                mendistribusikan konten tanpa izin tertulis.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">4. Akurasi Informasi</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Kami berusaha untuk menyediakan informasi yang akurat dan terkini. Namun, kami tidak menjamin 
                keakuratan, kelengkapan, atau ketepatan waktu dari informasi yang disajikan. Penggunaan informasi 
                di situs ini adalah risiko Anda sendiri.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <ExternalLink className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">5. Tautan ke Situs Lain</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas 
                konten, kebijakan privasi, atau praktik situs web pihak ketiga tersebut.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Scale className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">6. Batasan Tanggung Jawab</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                J.comNews tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial 
                yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan situs web kami.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">7. Perubahan Syarat</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Kami berhak mengubah Syarat & Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. 
                Perubahan akan berlaku efektif setelah dipublikasikan di halaman ini.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Gavel className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">8. Hukum yang Berlaku</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Syarat & Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
                Setiap sengketa akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">9. Hubungi Kami</h2>
              </div>
              <p className="text-foreground mb-4">
                Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami di:
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:j.comnews@gmail.com" className="text-primary hover:underline font-medium text-lg">
                  j.comnews@gmail.com
                </a>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

