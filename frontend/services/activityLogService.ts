import { api } from '../lib/api';

export const activityLogService = {
  list: async () => {
    const { data } = await api.get('/activity-logs');
    return data;
  },
};
