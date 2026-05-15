'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { api, setAuthToken } from '../../../lib/api';
import { clientService } from '../../../services/clientService';
import { leadService } from '../../../services/leadService';

export default function DashboardOverviewPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [stats, setStats] = useState({ clients: 0, leads: 0, activeProjects: 0, pendingInvoices: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);

    Promise.all([api.get('/tenants/me'), clientService.list(), leadService.list()])
      .then(([tenantResponse, clientsResponse, leadsResponse]) => {
        setTenant(tenantResponse.data);
        setStats((current) => ({ ...current, clients: clientsResponse.data.length, leads: leadsResponse.data.length }));
      })
      .catch(() => setError('Please login again.'));
  }, []);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">GrowthDesk AI Overview</h1>
          </div>

          {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

          <section className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Total Clients', stats.clients],
              ['Total Leads', stats.leads],
              ['Active Projects', stats.activeProjects],
              ['Pending Invoices', stats.pendingInvoices],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Workspace</h2>
            <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
              {JSON.stringify(tenant, null, 2)}
            </pre>
          </section>
        </section>
      </div>
    </main>
  );
}
