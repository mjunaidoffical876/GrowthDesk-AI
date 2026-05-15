'use client';

import { useEffect, useState } from 'react';
import { SuperAdminNav } from '@/components/super-admin/SuperAdminNav';
import { getSuperAdminAnalytics } from '@/services/superAdminService';

function Block({ title, rows }: { title: string; rows: any[] }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows?.map((row, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
            <span>{row.status || row.subscriptionStatus || row.toolType || 'Unknown'}</span>
            <strong>{row._count?._all ?? 0}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuperAdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getSuperAdminAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  return (
    <main className="grid min-h-screen gap-6 bg-slate-100 p-6 lg:grid-cols-[260px_1fr]">
      <SuperAdminNav />
      <section>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Block title="Tenant Status" rows={analytics?.tenantStatuses || []} />
          <Block title="Invoice Status" rows={analytics?.invoiceStatuses || []} />
          <Block title="Lead Status" rows={analytics?.leadStatuses || []} />
          <Block title="AI Usage by Tool" rows={analytics?.aiByTool || []} />
        </div>
      </section>
    </main>
  );
}
