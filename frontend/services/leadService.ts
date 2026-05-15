import { api } from '../lib/api';

export type LeadPayload = {
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  value?: number;
  notes?: string;
  followUpDate?: string;
};

export const leadService = {
  list: () => api.get('/leads'),
  create: (payload: LeadPayload) => api.post('/leads', payload),
  update: (id: string, payload: Partial<LeadPayload>) => api.patch(`/leads/${id}`, payload),
  remove: (id: string) => api.delete(`/leads/${id}`),
};
