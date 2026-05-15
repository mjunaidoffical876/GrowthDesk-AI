'use client';

import { useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../../../lib/api';
import { aiService, AIToolType } from '../../../services/aiService';

const tools: Array<{ type: AIToolType; title: string; desc: string; placeholder: string }> = [
  { type: 'blog_writer', title: 'Blog Writer', desc: 'Generate blog title, outline, intro, headings, and CTA.', placeholder: 'Write a blog outline about why small businesses need a modern website.' },
  { type: 'seo_meta', title: 'SEO Meta Generator', desc: 'Create SEO title, meta description, and keyword ideas.', placeholder: 'Generate SEO metadata for Website Innovator agency homepage.' },
  { type: 'proposal_writer', title: 'Proposal Generator', desc: 'Create client proposal content with scope and CTA.', placeholder: 'Create a proposal for an LMS website with payments and certificates.' },
  { type: 'email_reply', title: 'Email Reply Generator', desc: 'Generate polished client replies and follow-ups.', placeholder: 'Reply to a client asking if we can build an eCommerce website.' },
  { type: 'social_post', title: 'Social Post Generator', desc: 'Create posts with hook, body, CTA, and hashtags.', placeholder: 'Create a LinkedIn post about GrowthDesk AI launch.' },
];

export default function AIToolsPage() {
  const [toolType, setToolType] = useState<AIToolType>('seo_meta');
  const [prompt, setPrompt] = useState(tools[1].placeholder);
  const [tone, setTone] = useState('professional and confident');
  const [result, setResult] = useState('');
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedTool = useMemo(() => tools.find((tool) => tool.type === toolType)!, [toolType]);

  async function loadUsage() {
    const token = localStorage.getItem('growthdesk_token');
    setAuthToken(token);
    const res = await aiService.usage();
    setUsage(res.data);
  }

  useEffect(() => {
    loadUsage().catch(() => null);
  }, []);

  async function generate() {
    setLoading(true);
    setResult('');
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const res = await aiService.generate({ toolType, prompt, tone });
      setResult(res.data.response);
      await loadUsage();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-indigo-600">Premium module</p>
        <h1 className="text-3xl font-bold">AI Tools Engine</h1>
        <p className="text-slate-600">Generate agency-ready content while tracking tenant usage, tokens, and estimated cost.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Monthly Requests</p>
          <p className="mt-2 text-3xl font-bold">{usage?.monthlyRequests ?? 0}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Monthly Limit</p>
          <p className="mt-2 text-3xl font-bold">{usage?.monthlyLimit ?? 1000}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tokens</p>
          <p className="mt-2 text-3xl font-bold">{usage?.totalTokens ?? 0}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Est. Cost</p>
          <p className="mt-2 text-3xl font-bold">${Number(usage?.estimatedCost || 0).toFixed(4)}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => {
              setToolType(tool.type);
              setPrompt(tool.placeholder);
            }}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 ${toolType === tool.type ? 'border-indigo-500 ring-2 ring-indigo-100' : ''}`}
          >
            <p className="font-semibold">{tool.title}</p>
            <p className="mt-1 text-xs text-slate-500">{tool.desc}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">{selectedTool.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{selectedTool.desc}</p>

          <label className="mt-5 block text-sm font-medium">Tone</label>
          <input value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" />

          <label className="mt-4 block text-sm font-medium">Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={9} className="mt-1 w-full rounded-xl border px-3 py-2" />

          <button disabled={loading || prompt.length < 10} onClick={generate} className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Generated Result</h2>
            <button onClick={() => navigator.clipboard.writeText(result)} className="rounded-xl border px-3 py-2 text-sm">Copy</button>
          </div>
          <pre className="mt-4 min-h-[360px] whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">{result || 'Your generated content will appear here.'}</pre>
        </div>
      </section>
    </main>
  );
}
