import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebarNav, AdminMobileNav } from "@/components/admin/AdminNav";
import { getCurrentUser } from "@/lib/data/users";
import { getNotificationsForUser } from "@/lib/data/notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = await getNotificationsForUser(user.id);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="px-6 py-6">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>
        <AdminSidebarNav />
        <div className="px-6 py-6 text-xs text-text-secondary">Leviora Ventures Admin</div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader name={user.full_name ?? user.email} notifications={notifications} />
        <AdminMobileNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
