import Link from 'next/link';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Demo tenant</p>
        <h1 className="mt-3 text-4xl font-bold">Explore the beta workflow</h1>
        <p className="mt-4 text-slate-600">Use this demo entry point to test the SaaS flow before connecting real customers.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link className="rounded-xl border p-5 hover:bg-slate-50" href="/dashboard/overview">Tenant Dashboard</Link>
          <Link className="rounded-xl border p-5 hover:bg-slate-50" href="/super-admin/dashboard">Super Admin</Link>
          <Link className="rounded-xl border p-5 hover:bg-slate-50" href="/client-portal/overview">Client Portal</Link>
          <Link className="rounded-xl border p-5 hover:bg-slate-50" href="/onboarding">Onboarding</Link>
        </div>
      </section>
    </main>
  );
}
