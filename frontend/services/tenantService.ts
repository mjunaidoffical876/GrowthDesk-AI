import { api } from '../lib/api';

export type TenantSettingsPayload = {
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
};

export const tenantService = {
  me: async () => (await api.get('/tenants/me')).data,
  update: async (payload: TenantSettingsPayload) => (await api.patch('/tenants/me', payload)).data,
};
