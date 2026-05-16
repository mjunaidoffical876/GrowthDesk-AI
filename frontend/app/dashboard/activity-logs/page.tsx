import DashboardNav from '../../../components/DashboardNav';

export default function ActivityLogsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardNav />
      <section className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
        <p className="mt-2 text-slate-600">Audit trail foundation for tenant actions, security reviews, and enterprise accountability.</p>
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Tracked Events</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>User authentication and account activity</li>
            <li>Client, lead, project, task, invoice, ticket, and AI module changes</li>
            <li>Tenant-level security and admin actions</li>
            <li>IP address and metadata support for future compliance reporting</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
