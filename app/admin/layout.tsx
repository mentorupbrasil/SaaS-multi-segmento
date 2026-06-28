import { requirePlatformAdmin } from "@/lib/platform-admin";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePlatformAdmin();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar userName={session.user?.name ?? session.user?.email ?? ""} />
      <main className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
