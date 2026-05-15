'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { tenantService } from '../../../services/tenantService';

export default function SettingsPage() {
  const [form, setForm] = useState({ companyName: '', email: '', phone: '', website: '', logoUrl: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    tenantService.me().then((tenant) =>
      setForm({
        companyName: tenant?.companyName || '',
        email: tenant?.email || '',
        phone: tenant?.phone || '',
        website: tenant?.website || '',
        logoUrl: tenant?.logoUrl || '',
      }),
    );
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await tenantService.update(form);
    setMessage('Workspace settings saved successfully.');
  }

  return (
    <main className="grid min-h-screen grid-cols-[260px_1fr] gap-6 bg-slate-50 p-6">
      <DashboardNav />
      <section className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workspace Settings</h1>
          <p className="text-slate-600">Manage company profile and tenant-level information.</p>
        </div>
        <form onSubmit={save} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium">Company Name</label>
          <input className="w-full rounded-xl border px-3 py-2" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <label className="block text-sm font-medium">Company Email</label>
          <input className="w-full rounded-xl border px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="block text-sm font-medium">Phone</label>
          <input className="w-full rounded-xl border px-3 py-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label className="block text-sm font-medium">Website</label>
          <input className="w-full rounded-xl border px-3 py-2" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <label className="block text-sm font-medium">Logo URL</label>
          <input className="w-full rounded-xl border px-3 py-2" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
          <button className="rounded-xl bg-slate-900 px-5 py-2 text-white">Save Settings</button>
          {message && <p className="text-sm text-green-700">{message}</p>}
        </form>
      </section>
    </main>
  );
}
