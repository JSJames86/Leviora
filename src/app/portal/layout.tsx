import { redirect } from "next/navigation";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { getCurrentUser } from "@/lib/data/users";
import { getNotificationsForUser } from "@/lib/data/notifications";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = await getNotificationsForUser(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PortalHeader name={user.full_name ?? user.email} notifications={notifications} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
