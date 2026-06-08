import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackagePill, StatusPill } from "@/components/ui/Pill";
import { CopyButton } from "@/components/ui/CopyButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ChevronRightIcon, ArrowRightIcon, BriefcaseIcon, MessageIcon } from "@/components/ui/icons";
import { formatDate, formatRelativeTime, initials } from "@/lib/utils";
import { milestoneProgress, getEngagementsForClient } from "@/lib/data/engagements";
import { getClientDetail } from "@/lib/data/admin";

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [detail, engagements] = await Promise.all([getClientDetail(id), getEngagementsForClient(id)]);
  if (!detail) notFound();

  const { client, user, notes, internalNotes } = detail;

  const tabs: TabItem[] = [
    {
      key: "engagements",
      label: `Engagements (${engagements.length})`,
      content:
        engagements.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon className="size-6" />}
            title="No engagements yet"
            description="Engagements you create for this client will show up here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {engagements.map((engagement) => {
              const progress = milestoneProgress(engagement.milestones);
              return (
                <Link key={engagement.id} href={`/admin/engagements/${engagement.id}`}>
                  <Card className="h-full transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
                    <CardBody className="pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-heading text-lg font-medium text-text-primary">{engagement.title}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <PackagePill packageType={engagement.package_type} />
                            <StatusPill status={engagement.status} />
                          </div>
                        </div>
                        <ArrowRightIcon className="size-4 shrink-0 text-text-secondary" />
                      </div>
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                          <span>Milestones</span>
                          <span>
                            {progress.complete} of {progress.total} complete
                          </span>
                        </div>
                        <ProgressBar value={progress.complete} max={progress.total} />
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        ),
    },
    {
      key: "notes",
      label: `Client notes (${notes.length})`,
      content:
        notes.length === 0 ? (
          <EmptyState
            icon={<MessageIcon className="size-6" />}
            title="No notes yet"
            description="Notes exchanged with this client across their engagements will show up here."
          />
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/admin/engagements/${note.engagement_id}?tab=notes`}
                  className="block rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{note.engagementTitle}</p>
                    <p className="text-xs text-text-secondary">{formatRelativeTime(note.created_at)}</p>
                  </div>
                  <p className="mt-1.5 text-sm text-text-primary">{note.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        ),
    },
    {
      key: "internal",
      label: `Internal notes (${internalNotes.length})`,
      content:
        internalNotes.length === 0 ? (
          <EmptyState
            icon={<MessageIcon className="size-6" />}
            title="No internal notes yet"
            description="Notes your team leaves for each other on this client's engagements will show up here."
          />
        ) : (
          <ul className="space-y-3">
            {internalNotes.map((note) => (
              <li key={note.id} className="rounded-xl border border-border bg-accent/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{note.engagementTitle}</p>
                  <p className="text-xs text-text-secondary">{formatRelativeTime(note.created_at)}</p>
                </div>
                <p className="mt-1.5 text-sm text-text-primary">{note.body}</p>
              </li>
            ))}
          </ul>
        ),
    },
  ];

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-secondary">
        <Link href="/admin/clients" className="hover:text-primary">
          Clients
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="text-text-primary">{client.company_name ?? "Client"}</span>
      </nav>

      <div className="mb-8 flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary/50 text-lg font-medium text-[#3f6f87]">
          {initials(client.company_name ?? user?.full_name)}
        </span>
        <div>
          <h1 className="font-heading text-3xl font-medium text-text-primary">{client.company_name ?? "Unnamed company"}</h1>
          <p className="mt-1 text-text-secondary">{user?.full_name ?? user?.email ?? "No linked user"}</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardBody className="grid gap-x-8 gap-y-5 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Email</p>
            <p className="mt-1 text-sm font-medium text-text-primary">{user?.email ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Phone</p>
            <p className="mt-1 text-sm font-medium text-text-primary">{client.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Intake email</p>
            {client.intake_email ? (
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-text-primary">{client.intake_email}</code>
                <CopyButton value={client.intake_email} />
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-text-primary">—</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Client since</p>
            <p className="mt-1 text-sm font-medium text-text-primary">{formatDate(client.created_at)}</p>
          </div>
        </CardBody>
      </Card>

      <Tabs tabs={tabs} />
    </div>
  );
}
