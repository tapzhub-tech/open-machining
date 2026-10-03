import Link from 'next/link';

const columns = [
  {
    title: 'Platform',
    links: [
      { name: 'Opportunities', href: '/opportunities' },
      { name: 'Bid Management', href: '/bid-management' },
      { name: 'Manufacturing Network', href: '/network' },
      { name: 'Register as Vendor', href: '/register' },
    ],
  },
  {
    title: 'Manufacturing',
    links: [
      { name: 'Capabilities', href: '/capabilities' },
      { name: 'Contract Manufacturing', href: '/solution' },
      { name: 'CNC Machining', href: '/services/cnc-machining' },
      { name: 'Injection Moulding', href: '/services/injection-molding' },
      { name: 'Machine Server', href: '/machine-server' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Industries', href: '/industries' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold text-white mb-2">Open Machining</p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300 mb-4">
              From opportunity to delivery
            </p>
            <p className="text-sm leading-relaxed max-w-sm">
              We identify manufacturing opportunities, build the supply capability behind them, and manage
              execution from bid to delivery.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-white transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-sm">
          &copy; {currentYear} Open Machining. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
