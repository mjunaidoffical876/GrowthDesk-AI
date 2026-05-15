'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardNav } from '../../../components/DashboardNav';
import { setAuthToken } from '../../../lib/api';
import { taskService } from '../../../services/taskService';

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
  project?: { id: string; title: string };
  assignedTo?: { fullName: string };
};

const columns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'completed', label: 'Completed' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [message, setMessage] = useState('');

  async function loadTasks() {
    try {
      const token = localStorage.getItem('growthdesk_token');
      setAuthToken(token);
      const { data } = await taskService.list();
      setTasks(data);
    } catch {
      setMessage('Please login again.');
    }
  }

  useEffect(() => { loadTasks(); }, []);

  const grouped = useMemo(() => Object.fromEntries(columns.map((column) => [column.key, tasks.filter((task) => task.status === column.key)])), [tasks]);

  async function moveTask(id: string, status: string) {
    await taskService.update(id, { status } as any);
    await loadTasks();
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <DashboardNav />
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Operations</p>
          <h1 className="mt-2 text-3xl font-bold">Task Board</h1>
          <p className="mt-2 text-slate-600">A Kanban-style foundation for tracking all tasks across tenant projects.</p>
          {message && <p className="mt-6 rounded-xl bg-slate-100 p-4 text-sm">{message}</p>}

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
                      <p className="mt-1 text-xs text-slate-500">{task.project?.title || 'No project'} · {task.priority}</p>
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
        </section>
      </div>
    </main>
  );
}
