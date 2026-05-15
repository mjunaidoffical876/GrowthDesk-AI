import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <section className="max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">GrowthDesk AI</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Your complete business operating system.</h1>
        <p className="mt-6 text-lg text-slate-600">
          Manage leads, clients, projects, invoices, tickets, and AI content from one multi-tenant SaaS dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link className="rounded-xl bg-slate-900 px-6 py-3 text-white" href="/auth/register">Start Free Trial</Link>
          <Link className="rounded-xl border px-6 py-3" href="/auth/login">Login</Link>
        </div>
      </section>
    </main>
  );
}
