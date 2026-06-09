import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { CalendarIcon, LogOutIcon } from "@/components/ui/icons";
import { initials } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";
import type { Notification } from "@/types";

export function PortalHeader({ name, notifications }: { name: string; notifications: Notification[] }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/portal">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/portal/calendar"
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <CalendarIcon className="size-4" />
            <span className="hidden sm:inline">Calendar</span>
          </Link>
          <NotificationBell notifications={notifications} engagementBasePath="/portal/engagements" />
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
      </div>
    </header>
  );
}
