'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardNav } from '../../../../components/DashboardNav';
import { setAuthToken } from '../../../../lib/api';
import { clientService } from '../../../../services/clientService';
import { invoiceService } from '../../../../services/invoiceService';

type Client = { id: string; companyName: string };

type LineItem = { description: string; quantity: number; unitPrice: number };

export default function CreateInvoicePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadClients() {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const response = await clientService.list();
      setClients(response.data);
    }
    loadClients().catch(() => setMessage('Please login again.'));
  }, []);

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? {
      ...item,
      [field]: field === 'description' ? value : Number(value),
    } : item));
  }

  async function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const response = await invoiceService.create({
        clientId: String(form.get('clientId')),
        status: String(form.get('status') || 'draft'),
        taxAmount: Number(form.get('taxAmount') || 0),
        discount: Number(form.get('discount') || 0),
        paidAmount: Number(form.get('paidAmount') || 0),
        dueDate: String(form.get('dueDate') || '') || undefined,
        items: items.filter((item) => item.description.trim()).map((item) => ({
          description: item.description,
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.unitPrice || 0),
        })),
      });
      window.location.href = `/dashboard/invoices/${response.data.id}`;
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Invoice creation failed.');
    }
  }

  const subTotal = items.reduce((sum, item) => sum + Number(item.quantity || 1) * Number(item.unitPrice || 0), 0);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Billing</p>
          <h1 className="mt-2 text-3xl font-bold">Create Invoice</h1>
          <p className="mt-2 text-slate-600">Add client, invoice items, due date, tax, discount, and payment status.</p>

          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

          <form onSubmit={createInvoice} className="mt-6 space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <select name="clientId" className="rounded-xl border px-4 py-3" required>
                <option value="">Select client *</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
              </select>
              <select name="status" className="rounded-xl border px-4 py-3" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
              <input name="dueDate" type="date" className="rounded-xl border px-4 py-3" />
              <input name="paidAmount" type="number" step="0.01" placeholder="Paid amount" className="rounded-xl border px-4 py-3" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Invoice Items</h2>
                <button type="button" onClick={() => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])} className="rounded-xl border px-4 py-2 text-sm">Add item</button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_160px]">
                  <input value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} placeholder="Description" className="rounded-xl border px-4 py-3" required={index === 0} />
                  <input value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} type="number" min="1" className="rounded-xl border px-4 py-3" />
                  <input value={item.unitPrice} onChange={(event) => updateItem(index, 'unitPrice', event.target.value)} type="number" min="0" step="0.01" className="rounded-xl border px-4 py-3" />
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <input name="taxAmount" type="number" step="0.01" placeholder="Tax amount" className="rounded-xl border px-4 py-3" />
              <input name="discount" type="number" step="0.01" placeholder="Discount" className="rounded-xl border px-4 py-3" />
              <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xs text-slate-500">Current subtotal</p><p className="font-bold">${subTotal.toFixed(2)}</p></div>
            </div>

            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">Create Invoice</button>
          </form>
        </section>
      </div>
    </main>
  );
}
