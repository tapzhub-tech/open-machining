'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOCAL_LOGO_URL = '/assets/logo/logo.png';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [capOpen, setCapOpen] = useState(false);
  const [capShow, setCapShow] = useState(false);
  const [capTop, setCapTop] = useState<number>(80);
  const capRef = useRef<HTMLDivElement | null>(null);
  const capTriggerRef = useRef<HTMLButtonElement | null>(null);
  const capHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [solOpen, setSolOpen] = useState(false);
  const [solShow, setSolShow] = useState(false);
  const [solTop, setSolTop] = useState<number>(80);
  const solRef = useRef<HTMLDivElement | null>(null);
  const solTriggerRef = useRef<HTMLButtonElement | null>(null);
  const solHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mobileCapOpen, setMobileCapOpen] = useState(false);
  const [mobileSolOpen, setMobileSolOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  /* ---------- scroll shadow ---------- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const computeTop = (
    btn: HTMLButtonElement | null,
    setter: (v: number) => void
  ) => {
    if (!btn) return setter(80);
    const rect = btn.getBoundingClientRect();
    setter(Math.round(rect.bottom + window.scrollY + 8));
  };

  useEffect(() => {
    if (!capOpen) return;
    computeTop(capTriggerRef.current, setCapTop);
    const onWin = () => computeTop(capTriggerRef.current, setCapTop);
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, { passive: true });
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin);
    };
  }, [capOpen]);

  useEffect(() => {
    if (!solOpen) return;
    computeTop(solTriggerRef.current, setSolTop);
    const onWin = () => computeTop(solTriggerRef.current, setSolTop);
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, { passive: true });
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin);
    };
  }, [solOpen]);

  useEffect(() => {
    if (!capOpen) return setCapShow(false);
    setCapShow(false);
    const id = requestAnimationFrame(() => setCapShow(true));
    return () => cancelAnimationFrame(id);
  }, [capOpen]);

  useEffect(() => {
    if (!solOpen) return setSolShow(false);
    setSolShow(false);
    const id = requestAnimationFrame(() => setSolShow(true));
    return () => cancelAnimationFrame(id);
  }, [solOpen]);

  useEffect(() => {
    setCapOpen(false);
    setSolOpen(false);
    setMobileCapOpen(false);
    setMobileSolOpen(false);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (capOpen) {
        if (!capRef.current?.contains(t) && !capTriggerRef.current?.contains(t)) {
          setCapOpen(false);
        }
      }
      if (solOpen) {
        if (!solRef.current?.contains(t) && !solTriggerRef.current?.contains(t)) {
          setSolOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [capOpen, solOpen]);

  const openCap = () => {
    if (capHoverTimer.current) clearTimeout(capHoverTimer.current);
    setSolOpen(false);
    setCapOpen(true);
  };
  const closeCap = () => {
    if (capHoverTimer.current) clearTimeout(capHoverTimer.current);
    capHoverTimer.current = setTimeout(() => setCapOpen(false), 120);
  };

  const openSol = () => {
    if (solHoverTimer.current) clearTimeout(solHoverTimer.current);
    setCapOpen(false);
    setSolOpen(true);
  };
  const closeSol = () => {
    if (solHoverTimer.current) clearTimeout(solHoverTimer.current);
    solHoverTimer.current = setTimeout(() => setSolOpen(false), 120);
  };

  const navItems = [
    { name: "Capabilities", href: "/capabilities", isMega: "cap" as const },
    { name: "Industries", href: "/industries" },
    { name: "Machine Server", href: "/machine-server" },
    { name: "Solutions", href: "/solution", isMega: "sol" as const },
    { name: "Contact", href: "/contact" },
  ];

  const topLink =
    "text-slate-800 font-semibold hover:text-blue-700 transition-colors relative group px-3 py-2 rounded-md whitespace-nowrap";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 md:h-16 justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={LOCAL_LOGO_URL}
              alt="Open Manufacturing Logo"
              className="object-contain h-10 md:h-12 lg:h-14 w-auto"
            />
          </Link>

          {/* center nav */}
          <div className="hidden lg:flex flex-grow justify-center">
            <ul className="flex items-center space-x-1">
              <li>
                <Link href="/" className={topLink}>
                  Home
                </Link>
              </li>

              <li
                className="relative"
                onMouseEnter={() => {
                  computeTop(capTriggerRef.current, setCapTop);
                  openCap();
                }}
                onMouseLeave={closeCap}
              >
                <button
                  ref={capTriggerRef}
                  className={`${topLink} inline-flex items-center gap-1`}
                  onClick={() => router.push("/capabilities")}
                >
                  Capabilities
                  <ChevronDown
                    className={`h-4 w-4 ${capOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </li>

              <li
                className="relative"
                onMouseEnter={() => {
                  computeTop(solTriggerRef.current, setSolTop);
                  openSol();
                }}
                onMouseLeave={closeSol}
              >
                <button
                  ref={solTriggerRef}
                  className={`${topLink} inline-flex items-center gap-1`}
                  onClick={() => router.push("/solution")}
                >
                  Solutions
                  <ChevronDown
                    className={`h-4 w-4 ${solOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </li>

              {navItems
                .filter((n) => !n.isMega)
                .map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={topLink}>
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="hidden lg:flex items-center ml-auto">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition whitespace-nowrap"
            >
              Register a Vendor
            </Link>
          </div>

          <div className="lg:hidden ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsOpen((s) => !s)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                Home
              </Link>

              {/* Mobile Capabilities Dropdown */}
              <div className="space-y-1">
                <button
                  onClick={() => setMobileCapOpen(!mobileCapOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
                >
                  Capabilities
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileCapOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileCapOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-blue-200">
                    <Link
                      href="/capabilities"
                      className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition"
                    >
                      View All Capabilities
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/industries"
                className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                Industries
              </Link>

              <Link
                href="/machine-server"
                className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                Machine Server
              </Link>

              {/* Mobile Solutions Dropdown */}
              <div className="space-y-1">
                <button
                  onClick={() => setMobileSolOpen(!mobileSolOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
                >
                  Solutions
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileSolOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileSolOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-blue-200">
                    <Link
                      href="/solution"
                      className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition"
                    >
                      View All Solutions
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
              >
                Contact
              </Link>

              <div className="pt-2 border-t border-slate-200">
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition w-full"
                >
                  Register a Vendor
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
