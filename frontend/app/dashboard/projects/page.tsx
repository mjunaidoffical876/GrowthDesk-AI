'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { clientService } from '../../../services/clientService';
import { projectService } from '../../../services/projectService';

type Client = { id: string; companyName: string };
type Project = {
  id: string;
  title: string;
  status: string;
  budget?: string;
  deadline?: string;
  client?: Client;
  _count?: { tasks: number };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const [projectsResponse, clientsResponse] = await Promise.all([projectService.list(), clientService.list()]);
      setProjects(projectsResponse.data);
      setClients(clientsResponse.data);
    } catch {
      setMessage('Please login again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const budget = String(form.get('budget') || '');

    try {
      await projectService.create({
        title: String(form.get('title')),
        clientId: String(form.get('clientId') || '') || undefined,
        description: String(form.get('description') || ''),
        status: String(form.get('status') || 'active'),
        budget: budget ? Number(budget) : undefined,
        deadline: String(form.get('deadline') || '') || undefined,
      });
      event.currentTarget.reset();
      setMessage('Project created successfully.');
      await loadData();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Project creation failed.');
    }
  }

  async function deleteProject(id: string) {
    await projectService.remove(id);
    await loadData();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Delivery</p>
            <h1 className="mt-2 text-3xl font-bold">Projects</h1>
            <p className="mt-2 text-slate-600">Create client projects and track delivery progress from one workspace.</p>
          </div>

          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

          <form onSubmit={createProject} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
            <input name="title" placeholder="Project title *" className="rounded-xl border px-4 py-3" required />
            <select name="clientId" className="rounded-xl border px-4 py-3">
              <option value="">No client selected</option>
              {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
            </select>
            <select name="status" className="rounded-xl border px-4 py-3" defaultValue="active">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            <input name="budget" type="number" placeholder="Budget" className="rounded-xl border px-4 py-3" />
            <input name="deadline" type="date" className="rounded-xl border px-4 py-3" />
            <textarea name="description" placeholder="Description" className="rounded-xl border px-4 py-3 md:col-span-2" />
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-white md:col-span-2">Add Project</button>
          </form>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && <p className="rounded-2xl border bg-white p-6">Loading...</p>}
            {!loading && projects.length === 0 && <p className="rounded-2xl border bg-white p-6">No projects yet.</p>}
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/dashboard/projects/${project.id}`} className="text-lg font-bold hover:underline">{project.title}</Link>
                    <p className="mt-1 text-sm text-slate-500">{project.client?.companyName || 'Internal project'}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{project.status}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Tasks</p><p className="font-bold">{project._count?.tasks || 0}</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-slate-500">Deadline</p><p className="font-bold">{project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</p></div>
                </div>
                <button onClick={() => deleteProject(project.id)} className="mt-5 text-sm text-red-600">Archive project</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
