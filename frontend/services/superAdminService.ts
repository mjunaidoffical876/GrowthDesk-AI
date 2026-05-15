import { api, setAuthToken } from '@/lib/api';

function auth() {
  if (typeof window !== 'undefined') setAuthToken(localStorage.getItem('growthdesk_token'));
}

export async function getSuperAdminDashboard() {
  auth();
  const { data } = await api.get('/super-admin/dashboard');
  return data;
}

export async function getSuperAdminTenants() {
  auth();
  const { data } = await api.get('/super-admin/tenants');
  return data;
}

export async function getSuperAdminAnalytics() {
  auth();
  const { data } = await api.get('/super-admin/analytics');
  return data;
}

export async function getSuperAdminPlans() {
  auth();
  const { data } = await api.get('/super-admin/plans');
  return data;
}
