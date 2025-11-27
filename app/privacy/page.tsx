import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Kebijakan Privasi - J.comNews",
  description: "Kebijakan privasi J.comNews - Portal Berita Jabodetabek",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold mb-6 text-foreground">Kebijakan Privasi</h1>
          <p className="text-muted-foreground mb-8">Terakhir diperbarui: 27 November 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Pengenalan</h2>
            <p className="text-foreground mb-4">
              J.comNews ("kami", "kita", atau "situs") menghormati privasi pengunjung dan pengguna kami. 
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi 
              pribadi Anda ketika menggunakan situs web kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">2. Informasi yang Kami Kumpulkan</h2>
            <p className="text-foreground mb-4">Kami dapat mengumpulkan informasi berikut:</p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Informasi yang Anda berikan secara sukarela saat menghubungi kami atau berlangganan newsletter</li>
              <li>Data penggunaan situs web, termasuk alamat IP, jenis browser, dan halaman yang dikunjungi</li>
              <li>Cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Penggunaan Informasi</h2>
            <p className="text-foreground mb-4">Kami menggunakan informasi yang dikumpulkan untuk:</p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>Menyediakan dan meningkatkan layanan berita kami</li>
              <li>Merespons pertanyaan dan permintaan Anda</li>
              <li>Mengirimkan pembaruan dan newsletter (jika Anda berlangganan)</li>
              <li>Menganalisis penggunaan situs untuk meningkatkan konten dan fungsionalitas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">4. Perlindungan Data</h2>
            <p className="text-foreground mb-4">
              Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda 
              dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Cookie</h2>
            <p className="text-foreground mb-4">
              Situs kami menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur browser 
              Anda untuk menolak cookie, namun hal ini dapat mempengaruhi fungsionalitas situs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Tautan ke Situs Lain</h2>
            <p className="text-foreground mb-4">
              Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas 
              praktik privasi atau konten situs web tersebut.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">7. Perubahan Kebijakan</h2>
            <p className="text-foreground mb-4">
              Kami berhak mengubah Kebijakan Privasi ini kapan saja. Perubahan akan dipublikasikan di halaman ini 
              dengan tanggal pembaruan yang direvisi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">8. Hubungi Kami</h2>
            <p className="text-foreground mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
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

