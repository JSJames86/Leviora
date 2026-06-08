import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOutIcon } from "@/components/ui/icons";
import { initials } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import type { Notification } from "@/types";

export function AdminHeader({ name, notifications }: { name: string; notifications: Notification[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex items-center justify-end gap-4 px-6 py-4">
        <NotificationBell notifications={notifications} engagementBasePath="/admin/engagements" />
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-secondary/60 text-sm font-medium text-[#3f6f87]">
            {initials(name)}
          </span>
          <span className="text-sm font-medium text-text-primary">{name}</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-error hover:text-error"
            aria-label="Sign out"
          >
            <LogOutIcon className="size-4.5" />
          </button>
        </form>
      </div>
    </header>
  );
}
