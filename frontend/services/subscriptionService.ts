import { api } from '../lib/api';

export const subscriptionService = {
  listPlans() {
    return api.get('/subscriptions/plans');
  },
  getCurrent() {
    return api.get('/subscriptions/me');
  },
  changePlan(planId: string, billingCycle: 'monthly' | 'yearly') {
    return api.post('/subscriptions/change-plan', { planId, billingCycle });
  },
};
