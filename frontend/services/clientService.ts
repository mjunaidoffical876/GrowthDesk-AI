import { api } from '../lib/api';

export type ClientPayload = {
  companyName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  notes?: string;
  status?: string;
};

export const clientService = {
  list: () => api.get('/clients'),
  create: (payload: ClientPayload) => api.post('/clients', payload),
  update: (id: string, payload: Partial<ClientPayload>) => api.patch(`/clients/${id}`, payload),
  remove: (id: string) => api.delete(`/clients/${id}`),
};
