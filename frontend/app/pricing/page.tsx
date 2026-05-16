import Link from 'next/link';

const plans = [
  { name: 'Starter', price: '$49', users: '3 users', ai: '1,000 AI credits', best: false },
  { name: 'Growth', price: '$99', users: '10 users', ai: '5,000 AI credits', best: true },
  { name: 'Scale', price: '$199', users: '30 users', ai: '20,000 AI credits', best: false },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Pricing</p>
        <h1 className="mt-3 text-4xl font-bold">Simple plans for growing teams</h1>
        <p className="mt-4 text-slate-600">Start with beta pricing and upgrade as your workspace grows.</p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-2xl border bg-white p-6 shadow-sm">
            {plan.best && <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
            <h2 className="mt-4 text-2xl font-bold">{plan.name}</h2>
            <p className="mt-3 text-4xl font-bold">{plan.price}<span className="text-base font-medium text-slate-500">/mo</span></p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li>{plan.users}</li>
              <li>{plan.ai}</li>
              <li>CRM, projects, invoices, tickets</li>
              <li>Client portal access</li>
            </ul>
            <Link href="/auth/register" className="mt-6 block rounded-xl bg-slate-900 px-4 py-3 text-center font-semibold text-white">Start Trial</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
