import { ClientPortalNav } from '../../components/ClientPortalNav';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-slate-50 text-slate-900">
      <ClientPortalNav />
      <main className="min-h-screen flex-1 p-8">{children}</main>
    </div>
  );
}
