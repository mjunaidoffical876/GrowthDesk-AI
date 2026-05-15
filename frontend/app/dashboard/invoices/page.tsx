'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { invoiceService } from '../../../services/invoiceService';

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  totalAmount: string;
  paidAmount: string;
  dueDate?: string;
  client?: { companyName: string; contactPerson?: string };
  items?: Array<{ id: string }>;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadInvoices() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const response = await invoiceService.list();
      setInvoices(response.data);
    } catch {
      setMessage('Please login again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadInvoices(); }, []);

  async function markPaid(id: string) {
    await invoiceService.markPaid(id);
    await loadInvoices();
  }

  async function archiveInvoice(id: string) {
    await invoiceService.remove(id);
    await loadInvoices();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Billing</p>
              <h1 className="mt-2 text-3xl font-bold">Invoices</h1>
              <p className="mt-2 text-slate-600">Create invoices, track due payments, and manage manual paid status.</p>
            </div>
            <Link href="/dashboard/invoices/new" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Create Invoice</Link>
          </div>

          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

          <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4">Invoice</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td className="p-4" colSpan={6}>Loading...</td></tr>}
                {!loading && invoices.length === 0 && <tr><td className="p-4" colSpan={6}>No invoices yet.</td></tr>}
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t">
                    <td className="p-4"><Link href={`/dashboard/invoices/${invoice.id}`} className="font-semibold hover:underline">{invoice.invoiceNumber}</Link></td>
                    <td className="p-4">{invoice.client?.companyName || '-'}</td>
                    <td className="p-4">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-4">${Number(invoice.totalAmount).toFixed(2)}</td>
                    <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{invoice.status}</span></td>
                    <td className="flex gap-3 p-4">
                      {invoice.status !== 'paid' && <button onClick={() => markPaid(invoice.id)} className="text-emerald-700">Mark paid</button>}
                      <button onClick={() => archiveInvoice(invoice.id)} className="text-red-600">Archive</button>
                    </td>
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
