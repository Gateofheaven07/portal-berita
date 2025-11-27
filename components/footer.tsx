import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">J.comNews</h3>
            <p className="text-sm text-slate-600">
              Sumber berita terpercaya untuk Jabodetabek dengan informasi terkini dan berkualitas.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Kategori</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/berita-utama" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Berita Utama
                </Link>
              </li>
              <li>
                <Link href="/category/gaya-hidup" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Gaya Hidup
                </Link>
              </li>
              <li>
                <Link href="/category/kesehatan" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Kesehatan
                </Link>
              </li>
              <li>
                <Link href="/category/politik-hukum" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Politik & Hukum
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold mb-4">Halaman</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@portalberita.com" className="text-slate-600 hover:text-slate-900 transition-colors">
                j.comnews@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+621234567890" className="text-slate-600 hover:text-slate-900 transition-colors">
                  +62 (0) 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-slate-600">Jakarta, Jabodetabek</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
            <p>&copy; 2025 J.comNews. Hak Cipta Dilindungi.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
