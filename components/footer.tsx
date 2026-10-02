import Link from 'next/link';
import { Factory, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <Factory className="h-8 w-8 text-white group-hover:text-slate-300 transition-colors" />
              <span className="text-xl font-bold text-white">PrecisionMFG</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner for precision manufacturing and industrial services.
              Quality, speed, and expertise delivered.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/industries"
                  className="text-sm hover:text-white transition-colors"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services/cnc-machining"
                  className="text-sm hover:text-white transition-colors"
                >
                  CNC Machining
                </Link>
              </li>
              <li>
                <Link
                  href="/services/injection-molding"
                  className="text-sm hover:text-white transition-colors"
                >
                  Injection Molding
                </Link>
              </li>
              <li>
                <Link
                  href="/services/wire-edm"
                  className="text-sm hover:text-white transition-colors"
                >
                  Wire EDM
                </Link>
              </li>
              <li>
                <Link
                  href="/services/3d-printing"
                  className="text-sm hover:text-white transition-colors"
                >
                  3D Printing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  123 Industrial Parkway<br />
                  Manufacturing District<br />
                  Boston, MA 02101
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <span className="text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <span className="text-sm">info@precisionmfg.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} PrecisionMFG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
