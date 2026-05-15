'use client';

import { useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { teamService } from '../../../services/teamService';

type TeamMember = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadMembers() {
    setMembers(await teamService.list());
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function createMember(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await teamService.create(form as any);
      setForm({ fullName: '', email: '', password: '', role: 'staff' });
      setMessage('Team member added successfully.');
      await loadMembers();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Unable to add team member.');
    } finally {
      setLoading(false);
    }
  }

  async function deactivate(id: string) {
    await teamService.deactivate(id);
    await loadMembers();
  }

  return (
    <main className="grid min-h-screen grid-cols-[260px_1fr] gap-6 bg-slate-50 p-6">
      <DashboardNav />
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-slate-600">Invite and manage workspace users for this tenant.</p>
        </div>

        <form onSubmit={createMember} className="grid gap-3 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-5">
          <input className="rounded-xl border px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input className="rounded-xl border px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="rounded-xl border px-3 py-2" placeholder="Temporary password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="rounded-xl border px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="client">Client</option>
          </select>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</button>
        </form>
        {message && <p className="rounded-xl bg-white p-3 text-sm text-slate-700">{message}</p>}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t">
                  <td className="p-4 font-medium">{member.fullName}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4 capitalize">{member.role}</td>
                  <td className="p-4 capitalize">{member.status}</td>
                  <td className="p-4">
                    {member.status !== 'inactive' && <button onClick={() => deactivate(member.id)} className="rounded-lg border px-3 py-1 text-xs">Deactivate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
