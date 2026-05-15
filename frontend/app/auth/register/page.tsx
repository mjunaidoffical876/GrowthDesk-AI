'use client';

import { FormEvent, useState } from 'react';
import { api, setAuthToken } from '../../../lib/api';

export default function RegisterPage() {
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const { data } = await api.post('/auth/register', {
        fullName: form.get('fullName'),
        email: form.get('email'),
        password: form.get('password'),
        companyName: form.get('companyName'),
      });

      localStorage.setItem('growthdesk_token', data.token);
      setAuthToken(data.token);
      window.location.href = '/dashboard/overview';
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border">
        <h1 className="text-2xl font-bold">Create your workspace</h1>
        <p className="mt-2 text-sm text-slate-500">Start your GrowthDesk AI account.</p>

        <div className="mt-6 space-y-4">
          <input name="fullName" placeholder="Full name" className="w-full rounded-xl border px-4 py-3" required />
          <input name="companyName" placeholder="Company name" className="w-full rounded-xl border px-4 py-3" required />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-3" required />
          <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-4 py-3" required minLength={8} />
        </div>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <button className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-white">Create Account</button>
      </form>
    </main>
  );
}
