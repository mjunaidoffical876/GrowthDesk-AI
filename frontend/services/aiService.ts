import { api } from '../lib/api';

export type AIToolType = 'blog_writer' | 'seo_meta' | 'proposal_writer' | 'email_reply' | 'social_post';

export type GenerateAIPayload = {
  toolType: AIToolType;
  prompt: string;
  tone?: string;
};

export const aiService = {
  generate: (payload: GenerateAIPayload) => api.post('/ai/generate', payload),
  usage: () => api.get('/ai/usage'),
};
