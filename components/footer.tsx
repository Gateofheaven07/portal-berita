import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">J.comNews</h3>
            <p className="text-sm text-gray-600">
              Sumber berita terpercaya untuk Jabodetabek dengan informasi terkini dan berkualitas.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Kategori</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/category/berita-utama" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Berita Utama
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/gaya-hidup" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Gaya Hidup
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/kesehatan" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Kesehatan
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/politik-hukum" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Politik & Hukum
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Halaman</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200 inline-block hover:translate-x-1"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a 
                  href="mailto:j.comnews@gmail.com" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200"
                >
                  commcraft.23@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a 
                  href="tel:+621234567890" 
                  className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200"
                >
                  +62 896 5482 2326
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                <span className="text-gray-600">Depok, Jawa Barat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2025 J.comNews. Hak Cipta Dilindungi.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link 
                href="/privacy" 
                className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200"
              >
                Kebijakan Privasi
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-2 transition-all duration-200"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
