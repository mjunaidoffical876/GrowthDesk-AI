'use client';

import { FormEvent, useEffect, useState } from 'react';
import { clientPortalService } from '../../../services/clientPortalService';

export default function ClientPortalSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const loadTickets = () => clientPortalService.tickets().then(setTickets).catch(() => setTickets([]));

  useEffect(() => { loadTickets(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await clientPortalService.createTicket({ subject, description, priority: 'medium' });
    setSubject('');
    setDescription('');
    loadTickets();
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Support</h1>
      <form onSubmit={submit} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create Support Ticket</h2>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="mt-4 w-full rounded-xl border px-4 py-3" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue" className="mt-3 min-h-28 w-full rounded-xl border px-4 py-3" />
        <button className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Submit Ticket</button>
      </form>

      <div className="mt-6 space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-4">
              <h2 className="font-semibold">{ticket.subject}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{ticket.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{ticket.description}</p>
            {ticket.replies?.length > 0 && <p className="mt-4 text-sm font-semibold">Replies: {ticket.replies.length}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
