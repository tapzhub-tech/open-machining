'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOCAL_LOGO_URL = '/assets/logo/logo.png';

type NavItem = {
  name: string;
  href: string;
  children?: { name: string; href: string; description: string }[];
};

const navItems: NavItem[] = [
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Bid Management', href: '/bid-management' },
  {
    name: 'Manufacturing',
    href: '/capabilities',
    children: [
      { name: 'Capabilities', href: '/capabilities', description: 'Processes, materials and finishes' },
      { name: 'Contract Manufacturing', href: '/solution', description: 'Prototype → production → delivery' },
      { name: 'Machining Capacity', href: '/machine-server', description: 'Live machine capacity across the network' },
    ],
  },
  { name: 'Industries', href: '/industries' },
  { name: 'Network', href: '/network' },
  { name: 'About', href: '/about' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  const isActive = (item: NavItem) =>
    pathname === item.href || item.children?.some((c) => pathname === c.href);

  const topLink = (active: boolean) =>
    `px-3 py-2 rounded-md text-[15px] font-semibold whitespace-nowrap transition-colors ${
      active ? 'text-blue-700' : 'text-slate-800 hover:text-blue-700'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 md:h-16 justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={LOCAL_LOGO_URL} alt="Open Machining" className="object-contain h-10 md:h-12 w-auto" />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <li key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`${topLink(!!isActive(item))} inline-flex items-center gap-1`}
                    aria-haspopup="true"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition absolute left-0 top-full pt-2">
                    <ul className="w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-lg px-4 py-3 hover:bg-slate-50">
                            <span className="block font-semibold text-slate-900">{c.name}</span>
                            <span className="block text-sm text-slate-500">{c.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.name}>
                  <Link href={item.href} className={topLink(!!isActive(item))}>
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((s) => !s)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="py-4 space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                      aria-expanded={mobileExpanded === item.name}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
                    >
                      {item.name}
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${mobileExpanded === item.name ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileExpanded === item.name && (
                      <div className="ml-4 pl-2 border-l-2 border-blue-200 space-y-1">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition"
                  >
                    {item.name}
                  </Link>
                )
              )}
              <div className="pt-3 mt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-4 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Contact Us
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-3 rounded-md border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition"
                >
                  Join as Vendor
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
