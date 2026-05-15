'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { setAuthToken } from '../../../../lib/api';
import { ticketService } from '../../../../services/ticketService';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  async function loadTicket() {
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);
    const res = await ticketService.get(params.id);
    setTicket(res.data);
  }

  useEffect(() => {
    loadTicket().catch(() => null);
  }, [params.id]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    await ticketService.reply(params.id, { message, isInternal });
    setMessage('');
    setIsInternal(false);
    await loadTicket();
  }

  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <main className="space-y-6">
      <Link href="/dashboard/tickets" className="text-sm font-semibold text-indigo-600">← Back to Tickets</Link>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{ticket.priority} priority</p>
            <h1 className="mt-1 text-3xl font-bold">{ticket.subject}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{ticket.description || 'No description provided.'}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold capitalize">{ticket.status}</span>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Conversation</h2>
        <div className="mt-4 space-y-4">
          {ticket.replies?.length ? ticket.replies.map((reply: any) => (
            <div key={reply.id} className={`rounded-2xl border p-4 ${reply.isInternal ? 'bg-amber-50' : 'bg-slate-50'}`}>
              <div className="flex justify-between gap-4 text-xs text-slate-500">
                <span>{reply.user?.fullName || reply.client?.contactPerson || 'User'}</span>
                <span>{reply.isInternal ? 'Internal note' : 'Public reply'}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{reply.message}</p>
            </div>
          )) : <p className="text-sm text-slate-500">No replies yet.</p>}
        </div>
      </section>

      <form onSubmit={sendReply} className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Add Reply</h2>
        <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-4 w-full rounded-xl border px-3 py-2" placeholder="Write your reply..." />
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
          Internal note only
        </label>
        <button className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white">Send Reply</button>
      </form>
    </main>
  );
}
