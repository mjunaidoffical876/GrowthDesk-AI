'use client';

import { useEffect, useState } from 'react';
import { SuperAdminNav } from '@/components/super-admin/SuperAdminNav';
import { getSuperAdminDashboard } from '@/services/superAdminService';

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getSuperAdminDashboard().then(setStats).catch(console.error);
  }, []);

  const cards = [
    ['Tenants', stats?.tenants ?? 0],
    ['Users', stats?.users ?? 0],
    ['Projects', stats?.projects ?? 0],
    ['Invoices', stats?.invoices ?? 0],
    ['Tickets', stats?.tickets ?? 0],
    ['AI Requests', stats?.aiRequests ?? 0],
    ['Estimated MRR', `$${stats?.estimatedMrr ?? 0}`],
    ['Paid Revenue', `$${stats?.totalPaidValue ?? 0}`],
  ];

  return (
    <main className="grid min-h-screen gap-6 bg-slate-100 p-6 lg:grid-cols-[260px_1fr]">
      <SuperAdminNav />
      <section>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="mt-1 text-slate-600">GrowthDesk AI platform-wide control center.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
