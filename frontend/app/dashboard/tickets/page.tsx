'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setAuthToken } from '../../../lib/api';
import { ticketService } from '../../../services/ticketService';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', status: 'open' });

  async function loadTickets() {
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);
    const res = await ticketService.list();
    setTickets(res.data);
  }

  useEffect(() => {
    loadTickets().catch(() => null);
  }, []);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);
    await ticketService.create(form);
    setForm({ subject: '', description: '', priority: 'medium', status: 'open' });
    await loadTickets();
  }

  async function updateStatus(id: string, status: string) {
    await ticketService.update(id, { status });
    await loadTickets();
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-slate-600">Manage internal and client support workflows with priority, status, and replies.</p>
      </div>

      <form onSubmit={createTicket} className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Create Ticket</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-xl border px-3 py-2 md:col-span-2" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border px-3 py-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border px-3 py-2">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border px-3 py-2 md:col-span-4" />
        </div>
        <button className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white">Create Ticket</button>
      </form>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-4">Subject</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Replies</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t">
                <td className="p-4 font-medium"><Link href={`/dashboard/tickets/${ticket.id}`}>{ticket.subject}</Link></td>
                <td className="p-4 capitalize">{ticket.priority}</td>
                <td className="p-4">
                  <select value={ticket.status} onChange={(e) => updateStatus(ticket.id, e.target.value)} className="rounded-lg border px-2 py-1">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="p-4">{ticket._count?.replies || 0}</td>
                <td className="p-4"><Link className="font-semibold text-indigo-600" href={`/dashboard/tickets/${ticket.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
