import Link from "next/link"
import { ChevronLeft, Shield, Database, Eye, Lock, Cookie, ExternalLink, FileText, Mail } from "lucide-react"

export const metadata = {
  title: "Kebijakan Privasi - J.comNews",
  description: "Kebijakan privasi J.comNews - Portal Berita Jabodetabek",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Kebijakan Privasi</h1>
          <p className="text-xl text-white/90">Terakhir diperbarui: 27 November 2025</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-none">

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">1. Pengenalan</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                J.comNews ("kami", "kita", atau "situs") menghormati privasi pengunjung dan pengguna kami. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi 
                pribadi Anda ketika menggunakan situs web kami.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">2. Informasi yang Kami Kumpulkan</h2>
              </div>
              <p className="text-foreground mb-4">Kami dapat mengumpulkan informasi berikut:</p>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                <li>Informasi yang Anda berikan secara sukarela saat menghubungi kami atau berlangganan newsletter</li>
                <li>Data penggunaan situs web, termasuk alamat IP, jenis browser, dan halaman yang dikunjungi</li>
                <li>Cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">3. Penggunaan Informasi</h2>
              </div>
              <p className="text-foreground mb-4">Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                <li>Menyediakan dan meningkatkan layanan berita kami</li>
                <li>Merespons pertanyaan dan permintaan Anda</li>
                <li>Mengirimkan pembaruan dan newsletter (jika Anda berlangganan)</li>
                <li>Menganalisis penggunaan situs untuk meningkatkan konten dan fungsionalitas</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">4. Perlindungan Data</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda 
                dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Cookie className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">5. Cookie</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Situs kami menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur browser 
                Anda untuk menolak cookie, namun hal ini dapat mempengaruhi fungsionalitas situs.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <ExternalLink className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">6. Tautan ke Situs Lain</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas 
                praktik privasi atau konten situs web tersebut.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">7. Perubahan Kebijakan</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Kami berhak mengubah Kebijakan Privasi ini kapan saja. Perubahan akan dipublikasikan di halaman ini 
                dengan tanggal pembaruan yang direvisi.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">8. Hubungi Kami</h2>
              </div>
              <p className="text-foreground mb-4">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
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

