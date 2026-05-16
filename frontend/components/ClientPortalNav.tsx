import Link from 'next/link';

const items = [
  { href: '/client-portal/overview', label: 'Overview' },
  { href: '/client-portal/projects', label: 'Projects' },
  { href: '/client-portal/invoices', label: 'Invoices' },
  { href: '/client-portal/support', label: 'Support' },
];

export function ClientPortalNav() {
  return (
    <aside className="min-h-screen w-64 border-r bg-white p-6">
      <h2 className="text-xl font-bold">Client Portal</h2>
      <p className="mt-1 text-sm text-slate-500">GrowthDesk AI</p>
      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
