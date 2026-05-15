import { api } from '../lib/api';

export type TicketPayload = {
  clientId?: string;
  subject: string;
  description?: string;
  priority?: string;
  status?: string;
  assignedToId?: string;
};

export const ticketService = {
  list: () => api.get('/tickets'),
  get: (id: string) => api.get(`/tickets/${id}`),
  create: (payload: TicketPayload) => api.post('/tickets', payload),
  update: (id: string, payload: Partial<TicketPayload>) => api.patch(`/tickets/${id}`, payload),
  reply: (id: string, payload: { message: string; isInternal?: boolean }) => api.post(`/tickets/${id}/replies`, payload),
  remove: (id: string) => api.delete(`/tickets/${id}`),
};
