'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { leadService } from '../../../services/leadService';

type Lead = {
  id: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  value?: string;
};

const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadLeads() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const { data } = await leadService.list();
      setLeads(data);
    } catch {
      setMessage('Please login again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadLeads(); }, []);

  async function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = form.get('value');

    try {
      await leadService.create({
        fullName: String(form.get('fullName')),
        company: String(form.get('company') || ''),
        email: String(form.get('email') || ''),
        phone: String(form.get('phone') || ''),
        source: String(form.get('source') || ''),
        status: String(form.get('status') || 'new'),
        value: value ? Number(value) : undefined,
        notes: String(form.get('notes') || ''),
      });
      event.currentTarget.reset();
      setMessage('Lead created successfully.');
      await loadLeads();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Lead creation failed.');
    }
  }

  async function updateStatus(id: string, status: string) {
    await leadService.update(id, { status });
    await loadLeads();
  }

  async function deleteLead(id: string) {
    await leadService.remove(id);
    await loadLeads();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">CRM</p>
          <h1 className="mt-2 text-3xl font-bold">Leads Pipeline</h1>

          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

          <form onSubmit={createLead} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-3">
            <input name="fullName" placeholder="Lead name *" className="rounded-xl border px-4 py-3" required />
            <input name="company" placeholder="Company" className="rounded-xl border px-4 py-3" />
            <input name="email" type="email" placeholder="Email" className="rounded-xl border px-4 py-3" />
            <input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3" />
            <input name="source" placeholder="Source" className="rounded-xl border px-4 py-3" />
            <input name="value" type="number" placeholder="Deal value" className="rounded-xl border px-4 py-3" />
            <select name="status" className="rounded-xl border px-4 py-3">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <textarea name="notes" placeholder="Notes" className="rounded-xl border px-4 py-3 md:col-span-2" />
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white md:col-span-3">Add Lead</button>
          </form>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {statuses.map((status) => (
              <div key={status} className="rounded-2xl border bg-white p-4 shadow-sm">
                <h2 className="font-semibold capitalize">{status.replace('_', ' ')}</h2>
                <div className="mt-4 space-y-3">
                  {loading && status === 'new' && <p className="text-sm text-slate-500">Loading...</p>}
                  {leads.filter((lead) => lead.status === status).map((lead) => (
                    <article key={lead.id} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{lead.fullName}</h3>
                          <p className="text-sm text-slate-500">{lead.company || lead.email || 'No company'}</p>
                          {lead.value && <p className="mt-2 text-sm font-medium">Value: {lead.value}</p>}
                        </div>
                        <button onClick={() => deleteLead(lead.id)} className="text-xs text-red-600">Delete</button>
                      </div>
                      <select className="mt-3 w-full rounded-lg border px-3 py-2 text-sm" value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}>
                        {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
