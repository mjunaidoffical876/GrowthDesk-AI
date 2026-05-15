import { api } from '../lib/api';

export type TaskPayload = {
  projectId: string;
  title: string;
  assignedToId?: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
};

export const taskService = {
  list: (projectId?: string) => api.get('/tasks', { params: { projectId } }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (payload: TaskPayload) => api.post('/tasks', payload),
  update: (id: string, payload: Partial<TaskPayload>) => api.patch(`/tasks/${id}`, payload),
  remove: (id: string) => api.delete(`/tasks/${id}`),
};
