'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../../components/DashboardNav';
import { setAuthToken } from '../../../../lib/api';
import { invoiceService } from '../../../../services/invoiceService';

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  subTotal: string;
  taxAmount: string;
  discount: string;
  totalAmount: string;
  paidAmount: string;
  dueDate?: string;
  client?: { companyName: string; contactPerson?: string; email?: string; phone?: string };
  items: Array<{ id: string; description: string; quantity: number; unitPrice: string; total: string }>;
};

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [message, setMessage] = useState('');

  async function loadInvoice() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const response = await invoiceService.get(params.id);
      setInvoice(response.data);
    } catch {
      setMessage('Invoice not found or login expired.');
    }
  }

  useEffect(() => { loadInvoice(); }, [params.id]);

  async function markPaid() {
    await invoiceService.markPaid(params.id);
    await loadInvoice();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          {message && <p className="rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}
          {!invoice && !message && <p className="rounded-2xl border bg-white p-6">Loading...</p>}
          {invoice && (
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Invoice</p>
                  <h1 className="mt-2 text-3xl font-bold">{invoice.invoiceNumber}</h1>
                  <p className="mt-2 text-slate-600">Status: <span className="font-semibold">{invoice.status}</span></p>
                </div>
                {invoice.status !== 'paid' && <button onClick={markPaid} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Mark as Paid</button>}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Bill To</p>
                  <p className="mt-2 font-bold">{invoice.client?.companyName}</p>
                  <p className="text-sm text-slate-600">{invoice.client?.contactPerson}</p>
                  <p className="text-sm text-slate-600">{invoice.client?.email}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Due Date</p>
                  <p className="mt-2 font-bold">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Item</th><th className="p-4">Qty</th><th className="p-4">Rate</th><th className="p-4">Total</th></tr></thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-t"><td className="p-4">{item.description}</td><td className="p-4">{item.quantity}</td><td className="p-4">${Number(item.unitPrice).toFixed(2)}</td><td className="p-4">${Number(item.total).toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto mt-6 max-w-sm space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><strong>${Number(invoice.subTotal).toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Tax</span><strong>${Number(invoice.taxAmount).toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Discount</span><strong>${Number(invoice.discount).toFixed(2)}</strong></div>
                <div className="flex justify-between border-t pt-3 text-lg"><span>Total</span><strong>${Number(invoice.totalAmount).toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Paid</span><strong>${Number(invoice.paidAmount).toFixed(2)}</strong></div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
