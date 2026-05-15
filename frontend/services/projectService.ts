import { api } from '../lib/api';

export type ProjectPayload = {
  title: string;
  clientId?: string;
  description?: string;
  status?: string;
  budget?: number;
  deadline?: string;
};

export const projectService = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (payload: ProjectPayload) => api.post('/projects', payload),
  update: (id: string, payload: Partial<ProjectPayload>) => api.patch(`/projects/${id}`, payload),
  remove: (id: string) => api.delete(`/projects/${id}`),
};
