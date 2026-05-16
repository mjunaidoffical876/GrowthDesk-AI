'use client';

import { useEffect, useState } from 'react';
import { clientPortalService } from '../../../services/clientPortalService';

export default function ClientPortalInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    clientPortalService.invoices().then(setInvoices).catch(() => setInvoices([]));
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">My Invoices</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr><th className="p-4">Invoice</th><th className="p-4">Status</th><th className="p-4">Total</th><th className="p-4">Paid</th><th className="p-4">Due Date</th></tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="p-4 font-semibold">{invoice.invoiceNumber}</td>
                <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{invoice.status}</span></td>
                <td className="p-4">${invoice.totalAmount}</td>
                <td className="p-4">${invoice.paidAmount}</td>
                <td className="p-4">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
