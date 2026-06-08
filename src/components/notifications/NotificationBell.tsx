"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BellIcon } from "@/components/ui/icons";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Notification } from "@/types";

export function NotificationBell({
  notifications,
  engagementBasePath,
}: {
  notifications: Notification[];
  engagementBasePath: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const [syncedNotifications, setSyncedNotifications] = useState(notifications);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  if (notifications !== syncedNotifications) {
    setSyncedNotifications(notifications);
    setItems(notifications);
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    startTransition(async () => {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      router.refresh();
    });
  }

  function handleSelect(notification: Notification) {
    setOpen(false);
    setItems((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    startTransition(async () => {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notification.id }),
      });
      if (notification.engagement_id) router.push(`${engagementBasePath}/${notification.engagement_id}`);
      router.refresh();
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-primary hover:text-primary"
        aria-label="Notifications"
      >
        <BellIcon className="size-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[11px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-soft-lg)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-heading text-lg font-medium text-text-primary">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-secondary">You&apos;re all caught up.</p>
            ) : (
              items.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleSelect(notification)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent/30",
                    !notification.read && "bg-accent/15"
                  )}
                >
                  <span className="flex items-start gap-2 text-sm text-text-primary">
                    {!notification.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />}
                    <span className={cn(notification.read && "text-text-secondary")}>{notification.message}</span>
                  </span>
                  <span className="pl-3.5 text-xs text-text-secondary">{formatRelativeTime(notification.created_at)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
