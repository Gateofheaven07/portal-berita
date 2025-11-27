import Link from "next/link"
import { ChevronLeft, Users, Award, Briefcase, Palette } from "lucide-react"

export const metadata = {
  title: "Tentang Kami - J.comNews",
  description: "Tentang J.comNews - Portal Berita Jabodetabek",
}

export default function AboutPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Tentang Kami</h1>
          <p className="text-xl text-white/90">Mengenal lebih dekat J.comNews dan tim kami</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-none">

          <section className="mb-12">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Selamat Datang di J.comNews</h2>
              <p className="text-foreground text-lg leading-relaxed">
                J.comNEWS dihadirkan sebagai media informasi yang berfokus pada isu-isu seputar Jabodetabek, meliputi rubrik berita 
                utama, gaya hidup, kesehatan, politik, dan hukum. Kehadiran website ini diharapkan dapat memberikan kontribusi dalam penyebaran informasi yang akurat, menarik, dan bermanfaat.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <section className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Visi Kami</h2>
              </div>
              <p className="text-foreground leading-relaxed">
                Menjadi sumber informasi berita terdepan dan terpercaya di wilayah Jabodetabek, yang memberikan 
                kontribusi positif bagi masyarakat melalui jurnalisme yang berkualitas dan bertanggung jawab.
              </p>
            </section>

            <section className="bg-card rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Misi Kami</h2>
              </div>
              <ul className="list-disc pl-5 text-foreground space-y-2">
                <li>Menyediakan berita terkini dan akurat untuk masyarakat Jabodetabek</li>
                <li>Mengutamakan objektivitas dan kredibilitas dalam setiap pemberitaan</li>
                <li>Memberikan informasi yang relevan dan bermanfaat bagi pembaca</li>
                <li>Mendukung transparansi dan akuntabilitas dalam pemberitaan</li>
              </ul>
            </section>
          </div>

          {/* Struktur Organisasi */}
          <section className="mb-12">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Struktur Organisasi</h2>
              </div>

              {/* Kepemimpinan */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Kepemimpinan</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Ketua</p>
                    <p className="text-lg font-semibold text-foreground">Arcindy Oktaviawati</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Sekretaris</p>
                    <p className="text-lg font-semibold text-foreground">Nadira Putri Humaira</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Admin</p>
                    <p className="text-lg font-semibold text-foreground">Faris Rachmansyah</p>
                  </div>
                </div>
              </div>

              {/* Penanggung Jawab Bidang */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground border-b border-border pb-2">Penanggung Jawab Bidang</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Berita Utama</p>
                    <p className="text-lg font-semibold text-foreground">M. Raihan Alfazri</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Gaya Hidup</p>
                    <p className="text-lg font-semibold text-foreground">Erlin Waoma</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Kesehatan</p>
                    <p className="text-lg font-semibold text-foreground">Vita Talitha</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-1">Politik dan Hukum</p>
                    <p className="text-lg font-semibold text-foreground">Nadia Zulfah</p>
                  </div>
                </div>
              </div>

              {/* Desain Grafis */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Desain Grafis</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-lg font-semibold text-foreground">Zulkifli Abidin</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow">
                    <p className="text-lg font-semibold text-foreground">Rivaditya Novandi</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Kategori Berita</h2>
              <p className="text-foreground mb-4">Kami menyediakan berbagai kategori berita untuk memenuhi kebutuhan informasi Anda:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-1">Berita Utama</p>
                  <p className="text-sm text-muted-foreground">Berita-berita penting dan terkini yang menjadi perhatian utama</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-1">Gaya Hidup</p>
                  <p className="text-sm text-muted-foreground">Informasi tentang tren, tips, dan inspirasi gaya hidup</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-1">Kesehatan</p>
                  <p className="text-sm text-muted-foreground">Berita kesehatan, tips medis, dan informasi kesehatan terkini</p>
                </div>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="font-semibold text-foreground mb-1">Politik & Hukum</p>
                  <p className="text-sm text-muted-foreground">Berita politik, hukum, dan kebijakan yang mempengaruhi masyarakat</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Komitmen Kami</h2>
              <p className="text-foreground leading-relaxed">
                Kami berkomitmen untuk menjaga standar jurnalisme yang tinggi, menghormati privasi pembaca, 
                dan menyajikan informasi yang dapat dipertanggungjawabkan. Setiap artikel yang kami publikasikan 
                melalui proses verifikasi dan editing yang ketat.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Hubungi Kami</h2>
              <p className="text-foreground mb-6">
                Kami senang mendengar dari Anda. Jika Anda memiliki pertanyaan, saran, atau ingin berkolaborasi, 
                silakan hubungi kami:
              </p>
              <div className="space-y-4 text-foreground">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:j.comnews@gmail.com" className="text-primary hover:underline font-medium">j.comnews@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telepon</p>
                    <a href="tel:+621234567890" className="text-primary hover:underline font-medium">+62 (0) 123 456 7890</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alamat</p>
                    <p className="font-medium">Jakarta, Jabodetabek</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}

