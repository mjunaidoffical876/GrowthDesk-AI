'use client';

import Link from 'next/link';

const links = [
  { href: '/dashboard/overview', label: 'Overview' },
  { href: '/dashboard/clients', label: 'Clients' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/tasks', label: 'Tasks' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/ai-tools', label: 'AI Tools' },
  { href: '/dashboard/tickets', label: 'Tickets' },
  { href: '/dashboard/team', label: 'Team' },
  { href: '/dashboard/subscription', label: 'Subscription' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardNav() {
  return (
    <aside className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="px-3 text-xs font-bold uppercase tracking-widest text-slate-500">GrowthDesk AI</p>
      <nav className="mt-4 space-y-1">
        {links.map((link) => (
          <Link key={link.href} className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-slate-100" href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        className="mt-6 w-full rounded-xl border px-3 py-2 text-sm"
        onClick={() => {
          localStorage.removeItem('growthdesk_token');
          window.location.href = '/auth/login';
        }}
      >
        Logout
      </button>
    </aside>
  );
}
