'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { subscriptionService } from '../../../services/subscriptionService';

type Plan = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  monthlyPrice: string | number;
  yearlyPrice: string | number;
  userLimit: number;
  clientLimit: number;
  projectLimit: number;
  aiMonthlyLimit: number;
};

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);
    const [plansResponse, currentResponse] = await Promise.all([
      subscriptionService.listPlans(),
      subscriptionService.getCurrent(),
    ]);
    setPlans(plansResponse.data);
    setCurrent(currentResponse.data);
  }

  useEffect(() => {
    load().catch(() => setError('Unable to load subscription data.'));
  }, []);

  async function selectPlan(planId: string) {
    setMessage('');
    setError('');
    try {
      await subscriptionService.changePlan(planId, billingCycle);
      setMessage('Plan updated successfully. Payment gateway integration will be connected in the next billing milestone.');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to change plan.');
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Billing Foundation</p>
          <h1 className="mt-2 text-3xl font-bold">Subscription & Usage</h1>

          {message && <p className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">{message}</p>}
          {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

          <section className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Users', `${current?.usage?.users || 0}/${current?.limits?.userLimit || '-'}`],
              ['Clients', `${current?.usage?.clients || 0}/${current?.limits?.clientLimit || '-'}`],
              ['Projects', `${current?.usage?.projects || 0}/${current?.limits?.projectLimit || '-'}`],
              ['AI Requests', `${current?.usage?.aiRequestsThisMonth || 0}/${current?.limits?.aiMonthlyLimit || '-'}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-3 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </section>

          <div className="mt-8 flex gap-3">
            <button onClick={() => setBillingCycle('monthly')} className={`rounded-xl border px-4 py-2 ${billingCycle === 'monthly' ? 'bg-slate-950 text-white' : 'bg-white'}`}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle('yearly')} className={`rounded-xl border px-4 py-2 ${billingCycle === 'yearly' ? 'bg-slate-950 text-white' : 'bg-white'}`}>
              Yearly
            </button>
          </div>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              const active = current?.plan?.id === plan.id;
              return (
                <div key={plan.id} className={`rounded-2xl border bg-white p-6 shadow-sm ${active ? 'ring-2 ring-slate-950' : ''}`}>
                  <p className="text-xl font-bold">{plan.name}</p>
                  <p className="mt-2 min-h-12 text-sm text-slate-500">{plan.description || 'GrowthDesk AI subscription plan'}</p>
                  <p className="mt-5 text-3xl font-black">${String(price)}</p>
                  <p className="text-sm text-slate-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    <li>{plan.userLimit} team users</li>
                    <li>{plan.clientLimit} clients</li>
                    <li>{plan.projectLimit} projects</li>
                    <li>{plan.aiMonthlyLimit} AI requests/month</li>
                  </ul>
                  <button
                    onClick={() => selectPlan(plan.id)}
                    className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                    disabled={active}
                  >
                    {active ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </section>
        </section>
      </div>
    </main>
  );
}
