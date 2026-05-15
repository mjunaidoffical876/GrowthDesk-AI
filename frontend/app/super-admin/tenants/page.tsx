'use client';

import { useEffect, useState } from 'react';
import { SuperAdminNav } from '@/components/super-admin/SuperAdminNav';
import { getSuperAdminTenants } from '@/services/superAdminService';

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    getSuperAdminTenants().then(setTenants).catch(console.error);
  }, []);

  return (
    <main className="grid min-h-screen gap-6 bg-slate-100 p-6 lg:grid-cols-[260px_1fr]">
      <SuperAdminNav />
      <section>
        <h1 className="text-3xl font-bold">Tenants</h1>
        <p className="mt-1 text-slate-600">Monitor all workspaces, plans, and usage.</p>
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr><th className="p-4">Company</th><th>Plan</th><th>Status</th><th>Users</th><th>Projects</th><th>AI</th></tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-t">
                  <td className="p-4"><strong>{tenant.companyName}</strong><br /><span className="text-slate-500">{tenant.email}</span></td>
                  <td>{tenant.subscriptionPlan?.name || 'Trial'}</td>
                  <td><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{tenant.subscriptionStatus}</span></td>
                  <td>{tenant._count?.users ?? 0}</td>
                  <td>{tenant._count?.projects ?? 0}</td>
                  <td>{tenant._count?.aiRequests ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
