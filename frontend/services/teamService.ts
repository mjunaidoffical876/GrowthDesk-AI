import { api } from '../lib/api';

export type TeamMemberPayload = {
  fullName: string;
  email: string;
  password: string;
  role?: 'owner' | 'manager' | 'staff' | 'client';
};

export const teamService = {
  list: async () => (await api.get('/users')).data,
  create: async (payload: TeamMemberPayload) => (await api.post('/users', payload)).data,
  update: async (id: string, payload: Partial<Omit<TeamMemberPayload, 'email' | 'password'>>) =>
    (await api.patch(`/users/${id}`, payload)).data,
  deactivate: async (id: string) => (await api.patch(`/users/${id}/deactivate`)).data,
};
