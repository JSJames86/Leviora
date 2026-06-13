"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GaugeIcon, UsersIcon, FileCheckIcon, SparkleIcon } from "@/components/ui/icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: GaugeIcon },
  { href: "/admin/clients", label: "Clients", icon: UsersIcon },
  { href: "/admin/documents", label: "Documents", icon: FileCheckIcon },
  { href: "/admin/library", label: "Library", icon: SparkleIcon },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
            isActive(pathname, href) ? "bg-accent/50 text-primary" : "text-text-secondary hover:bg-accent/25 hover:text-text-primary"
          )}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2 lg:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(pathname, href) ? "bg-accent/50 text-primary" : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
