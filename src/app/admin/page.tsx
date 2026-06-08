import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import {
  UsersIcon,
  BriefcaseIcon,
  FileCheckIcon,
  MessageIcon,
  ArrowRightIcon,
  AlertIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";
import { formatRelativeTime } from "@/lib/utils";
import { getCurrentUser } from "@/lib/data/users";
import { getAdminStats, getActivityFeed, getActionItems, type ActivityItem, type ActionItem } from "@/lib/data/admin";

const ACTIVITY_ICONS: Record<ActivityItem["kind"], typeof MessageIcon> = {
  note: MessageIcon,
  milestone: CheckCircleIcon,
  document: DocumentIcon,
  engagement: BriefcaseIcon,
};

const ACTION_ICONS: Record<ActionItem["kind"], typeof MessageIcon> = {
  document: FileCheckIcon,
  note: MessageIcon,
  idle: AlertIcon,
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const [stats, activity, actionItems] = await Promise.all([getAdminStats(), getActivityFeed(), getActionItems()]);
  const firstName = (user?.full_name ?? "").split(" ")[0] || "there";

  const statCards = [
    { label: "Active clients", value: stats.activeClients, icon: UsersIcon },
    { label: "Active engagements", value: stats.activeEngagements, icon: BriefcaseIcon },
    { label: "Documents pending review", value: stats.documentsPendingReview, icon: FileCheckIcon },
    { label: "Notes this week", value: stats.unreadNotes, icon: MessageIcon },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-text-primary">Welcome back, {firstName}</h1>
        <p className="mt-1 text-text-secondary">Here&apos;s what&apos;s happening across Leviora&apos;s engagements today.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardBody className="pt-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent/50 text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="mt-4 font-heading text-3xl font-medium text-text-primary">{card.value}</p>
                <p className="mt-1 text-sm text-text-secondary">{card.label}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardBody className="pt-6">
            <h2 className="font-heading text-xl font-medium text-text-primary">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="mt-6 text-sm text-text-secondary">
                Nothing&apos;s happened yet — activity will show up here as your team and clients get to work.
              </p>
            ) : (
              <ol className="mt-5 space-y-4">
                {activity.map((item) => {
                  const Icon = ACTIVITY_ICONS[item.kind];
                  return (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/40 text-primary">
                        <Icon className="size-4.5" />
                      </span>
                      <div>
                        <p className="text-sm text-text-primary">{item.message}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">{formatRelativeTime(item.createdAt)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="pt-6">
            <h2 className="font-heading text-xl font-medium text-text-primary">Needs your attention</h2>
            {actionItems.length === 0 ? (
              <p className="mt-6 text-sm text-text-secondary">You&apos;re all caught up — nothing needs attention right now.</p>
            ) : (
              <ul className="mt-5 space-y-2.5">
                {actionItems.map((item) => {
                  const Icon = ACTION_ICONS[item.kind];
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary"
                      >
                        <span className="flex items-center gap-3 text-text-primary">
                          <Icon className="size-4.5 text-primary" />
                          {item.label}
                        </span>
                        <ArrowRightIcon className="size-4 shrink-0 text-text-secondary" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
