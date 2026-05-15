import { api } from '../lib/api';

export type InvoiceItemPayload = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoicePayload = {
  clientId: string;
  invoiceNumber?: string;
  status?: string;
  taxAmount?: number;
  discount?: number;
  paidAmount?: number;
  dueDate?: string;
  items: InvoiceItemPayload[];
};

export const invoiceService = {
  list: () => api.get('/invoices'),
  get: (id: string) => api.get(`/invoices/${id}`),
  create: (payload: InvoicePayload) => api.post('/invoices', payload),
  update: (id: string, payload: Partial<InvoicePayload>) => api.patch(`/invoices/${id}`, payload),
  markPaid: (id: string) => api.patch(`/invoices/${id}/mark-paid`),
  remove: (id: string) => api.delete(`/invoices/${id}`),
};
