import { api } from '../lib/api';

export const clientPortalService = {
  overview: async () => {
    const { data } = await api.get('/client-portal/overview');
    return data;
  },
  projects: async () => {
    const { data } = await api.get('/client-portal/projects');
    return data;
  },
  invoices: async () => {
    const { data } = await api.get('/client-portal/invoices');
    return data;
  },
  tickets: async () => {
    const { data } = await api.get('/client-portal/tickets');
    return data;
  },
  createTicket: async (payload: { subject: string; description?: string; priority?: string }) => {
    const { data } = await api.post('/client-portal/tickets', payload);
    return data;
  },
};
