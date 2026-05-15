'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DashboardNav } from '../../../../components/DashboardNav';
import { setAuthToken } from '../../../../lib/api';
import { projectService } from '../../../../services/projectService';
import { taskService } from '../../../../services/taskService';

type Task = { id: string; title: string; status: string; priority: string; dueDate?: string; description?: string };
type Project = { id: string; title: string; status: string; description?: string; client?: { companyName: string }; tasks: Task[] };

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'completed', label: 'Completed' },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [message, setMessage] = useState('');

  async function loadProject() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const { data } = await projectService.get(projectId);
      setProject(data);
    } catch {
      setMessage('Project not found or login required.');
    }
  }

  useEffect(() => { loadProject(); }, [projectId]);

  const grouped = useMemo(() => Object.fromEntries(columns.map((column) => [column.key, (project?.tasks || []).filter((task) => task.status === column.key)])), [project]);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await taskService.create({
        projectId,
        title: String(form.get('title')),
        description: String(form.get('description') || ''),
        priority: String(form.get('priority') || 'medium'),
        status: String(form.get('status') || 'todo'),
        dueDate: String(form.get('dueDate') || '') || undefined,
      });
      event.currentTarget.reset();
      await loadProject();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || 'Task creation failed.');
    }
  }

  async function moveTask(id: string, status: string) {
    await taskService.update(id, { status } as any);
    await loadProject();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <Link href="/dashboard/projects" className="text-sm font-medium text-slate-600 hover:underline">← Back to projects</Link>
          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}
          {!project ? <p className="mt-6 rounded-2xl border bg-white p-6">Loading...</p> : (
            <>
              <div className="mt-4 rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Project Workspace</p>
                <h1 className="mt-2 text-3xl font-bold">{project.title}</h1>
                <p className="mt-2 text-slate-600">{project.client?.companyName || 'Internal project'} · {project.status}</p>
                {project.description && <p className="mt-4 text-sm text-slate-700">{project.description}</p>}
              </div>

              <form onSubmit={createTask} className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
                <input name="title" placeholder="Task title *" className="rounded-xl border px-4 py-3" required />
                <select name="priority" className="rounded-xl border px-4 py-3" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <select name="status" className="rounded-xl border px-4 py-3" defaultValue="todo">
                  {columns.map((column) => <option key={column.key} value={column.key}>{column.label}</option>)}
                </select>
                <input name="dueDate" type="date" className="rounded-xl border px-4 py-3" />
                <textarea name="description" placeholder="Task description" className="rounded-xl border px-4 py-3 md:col-span-2" />
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-white md:col-span-2">Add Task</button>
              </form>

              <div className="mt-6 grid gap-4 xl:grid-cols-4">
                {columns.map((column) => (
                  <div key={column.key} className="rounded-2xl border bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-bold">{column.label}</h2>
                      <span className="rounded-full bg-white px-3 py-1 text-xs">{grouped[column.key]?.length || 0}</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {grouped[column.key]?.map((task) => (
                        <article key={task.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                          <p className="font-semibold">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-500">Priority: {task.priority}</p>
                          <p className="mt-1 text-xs text-slate-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</p>
                          <select className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" value={task.status} onChange={(event) => moveTask(task.id, event.target.value)}>
                            {columns.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                          </select>
                        </article>
                      ))}
                      {grouped[column.key]?.length === 0 && <p className="rounded-xl border border-dashed bg-white p-4 text-sm text-slate-500">No tasks.</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
