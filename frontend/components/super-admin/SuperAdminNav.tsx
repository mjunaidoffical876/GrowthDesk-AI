import Link from 'next/link';

const links = [
  { href: '/super-admin/dashboard', label: 'Dashboard' },
  { href: '/super-admin/tenants', label: 'Tenants' },
  { href: '/super-admin/analytics', label: 'Analytics' },
  { href: '/super-admin/plans', label: 'Plans' },
  { href: '/dashboard/overview', label: 'Tenant App' },
];

export function SuperAdminNav() {
  return (
    <aside className="rounded-2xl border bg-slate-950 p-4 text-white shadow-sm">
      <p className="px-3 text-xs font-bold uppercase tracking-widest text-slate-300">Super Admin</p>
      <nav className="mt-4 space-y-1">
        {links.map((link) => (
          <Link key={link.href} className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/10" href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
