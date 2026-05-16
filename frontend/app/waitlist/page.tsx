export default function WaitlistPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Join beta</p>
        <h1 className="mt-3 text-4xl font-bold">Request early access</h1>
        <form className="mt-8 space-y-4">
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Full name" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Work email" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Company name" />
          <button className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white" type="button">Submit Request</button>
        </form>
      </section>
    </main>
  );
}
