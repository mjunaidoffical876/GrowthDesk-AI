'use client';

import { useEffect, useState } from 'react';
import { SuperAdminNav } from '@/components/super-admin/SuperAdminNav';
import { getSuperAdminPlans } from '@/services/superAdminService';

export default function SuperAdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    getSuperAdminPlans().then(setPlans).catch(console.error);
  }, []);

  return (
    <main className="grid min-h-screen gap-6 bg-slate-100 p-6 lg:grid-cols-[260px_1fr]">
      <SuperAdminNav />
      <section>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold">${plan.monthlyPrice}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Users: {plan.userLimit}</p>
                <p>AI Monthly Limit: {plan.aiMonthlyLimit}</p>
                <p>Projects: {plan.projectLimit}</p>
                <p>Clients: {plan.clientLimit}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
