import Link from 'next/link';

const features = [
  'CRM and lead pipeline',
  'Projects, tasks, and client portal',
  'Invoices and subscription usage',
  'AI content generation tools',
  'Support tickets and activity logs',
  'Super admin SaaS control center',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
        <p className="rounded-full border bg-white px-4 py-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
          GrowthDesk AI Beta
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Run your agency from one AI-powered operating system.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Manage leads, clients, projects, invoices, tickets, AI content, subscriptions, and client communication from one clean multi-tenant SaaS platform.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white" href="/auth/register">Start Free Trial</Link>
          <Link className="rounded-xl border bg-white px-6 py-3 font-semibold" href="/demo">View Demo Flow</Link>
          <Link className="rounded-xl border bg-white px-6 py-3 font-semibold" href="/pricing">Pricing</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature} className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{feature}</h3>
            <p className="mt-2 text-sm text-slate-600">Built into the beta launch foundation and ready for production refinement.</p>
          </div>
        ))}
      </section>
    </main>
  );
}
