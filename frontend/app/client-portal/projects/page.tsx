'use client';

import { useEffect, useState } from 'react';
import { clientPortalService } from '../../../services/clientPortalService';

export default function ClientPortalProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    clientPortalService.projects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold">My Projects</h1>
      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{project.description || 'No description added.'}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">{project.status}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {['todo', 'in_progress', 'review', 'completed'].map((status) => (
                <div key={status} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold capitalize">{status.replace('_', ' ')}</p>
                  <p className="mt-2 text-2xl font-bold">{project.tasks?.filter((task: any) => task.status === status).length ?? 0}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
