'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { clientService } from '../../../services/clientService';

type Client = {
  id: string;
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: string;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadClients() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const { data } = await clientService.list();
      setClients(data);
    } catch {
      setMessage('Please login again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadClients(); }, []);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await clientService.create({
        companyName: String(form.get('companyName')),
        contactPerson: String(form.get('contactPerson') || ''),
        email: String(form.get('email') || ''),
        phone: String(form.get('phone') || ''),
        notes: String(form.get('notes') || ''),
      });
      event.currentTarget.reset();
      setMessage('Client created successfully.');
      await loadClients();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Client creation failed.');
    }
  }

  async function deleteClient(id: string) {
    await clientService.remove(id);
    await loadClients();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">CRM</p>
              <h1 className="mt-2 text-3xl font-bold">Clients</h1>
            </div>
          </div>

          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

          <form onSubmit={createClient} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
            <input name="companyName" placeholder="Company name *" className="rounded-xl border px-4 py-3" required />
            <input name="contactPerson" placeholder="Contact person" className="rounded-xl border px-4 py-3" />
            <input name="email" type="email" placeholder="Email" className="rounded-xl border px-4 py-3" />
            <input name="phone" placeholder="Phone" className="rounded-xl border px-4 py-3" />
            <textarea name="notes" placeholder="Notes" className="rounded-xl border px-4 py-3 md:col-span-2" />
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white md:col-span-2">Add Client</button>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td className="p-4" colSpan={6}>Loading...</td></tr>}
                {!loading && clients.length === 0 && <tr><td className="p-4" colSpan={6}>No clients yet.</td></tr>}
                {clients.map((client) => (
                  <tr key={client.id} className="border-t">
                    <td className="p-4 font-medium">{client.companyName}</td>
                    <td className="p-4">{client.contactPerson || '-'}</td>
                    <td className="p-4">{client.email || '-'}</td>
                    <td className="p-4">{client.phone || '-'}</td>
                    <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{client.status}</span></td>
                    <td className="p-4"><button onClick={() => deleteClient(client.id)} className="text-red-600">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
