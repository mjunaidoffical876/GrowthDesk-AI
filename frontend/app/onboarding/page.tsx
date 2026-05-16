const steps = [
  'Create your workspace',
  'Add team members',
  'Import clients and leads',
  'Create your first project',
  'Generate your first invoice',
  'Use AI tools for content and proposals',
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Beta onboarding</p>
        <h1 className="mt-3 text-4xl font-bold">Launch your GrowthDesk workspace</h1>
        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-xl border p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{index + 1}</span>
              <div>
                <h2 className="font-semibold">{step}</h2>
                <p className="text-sm text-slate-600">Complete this step to prepare your workspace for real customers.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
