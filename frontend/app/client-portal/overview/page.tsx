'use client';

import { useEffect, useState } from 'react';
import { clientPortalService } from '../../../services/clientPortalService';

export default function ClientPortalOverviewPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    clientPortalService.overview().then(setData).catch(() => setData(null));
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">Client Overview</h1>
      <p className="mt-2 text-slate-600">Track your active work, invoices, and support requests.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Projects</p><h3 className="mt-2 text-3xl font-bold">{data?.counts?.projects ?? 0}</h3></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Invoices</p><h3 className="mt-2 text-3xl font-bold">{data?.counts?.invoices ?? 0}</h3></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-slate-500">Tickets</p><h3 className="mt-2 text-3xl font-bold">{data?.counts?.tickets ?? 0}</h3></div>
      </div>
    </section>
  );
}
