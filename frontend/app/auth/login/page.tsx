'use client';

import { FormEvent, useState } from 'react';
import { api, setAuthToken } from '../../../lib/api';

export default function LoginPage() {
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const { data } = await api.post('/auth/login', {
        email: form.get('email'),
        password: form.get('password'),
      });

      localStorage.setItem('growthdesk_token', data.token);
      setAuthToken(data.token);
      window.location.href = '/dashboard/overview';
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Login to GrowthDesk AI.</p>

        <div className="mt-6 space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-3" required />
          <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-3" required minLength={8} />
        </div>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-white">Login</button>
      </form>
    </main>
  );
}
