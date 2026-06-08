import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { PackagePill, StatusPill } from "@/components/ui/Pill";
import { ChevronRightIcon } from "@/components/ui/icons";
import { NotesThread } from "@/components/shared/NotesThread";
import { EngagementDetailsPanel } from "@/components/shared/EngagementDetailsPanel";
import { AdminMilestoneManager } from "@/components/admin/AdminMilestoneManager";
import { AdminDeliverablesManager } from "@/components/admin/AdminDeliverablesManager";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";
import { getEngagementDetail } from "@/lib/data/engagements";
import { addNote, addInternalNote, updateMilestoneStatus, addDeliverable, removeDeliverable } from "@/lib/data/actions";
import type { DeliverableType, MilestoneStatus } from "@/types";

export default async function AdminEngagementDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const detail = await getEngagementDetail(id);
  if (!detail) notFound();

  const { engagement, milestones, deliverables, notes, internalNotes, authors } = detail;

  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", engagement.client_id).maybeSingle();

  const basePath = `/admin/engagements/${id}`;

  async function submitNote(body: string) {
    "use server";
    return addNote(id, body, basePath);
  }
  async function submitInternalNote(body: string) {
    "use server";
    return addInternalNote(id, body, basePath);
  }
  async function changeMilestoneStatus(milestoneId: string, status: MilestoneStatus) {
    "use server";
    return updateMilestoneStatus(milestoneId, status, basePath);
  }
  async function createDeliverable(input: { title: string; type: DeliverableType; url: string; milestoneId: string | null }) {
    "use server";
    return addDeliverable(id, input, basePath);
  }
  async function deleteDeliverable(deliverableId: string) {
    "use server";
    return removeDeliverable(deliverableId, basePath);
  }

  const tabs: TabItem[] = [
    {
      key: "progress",
      label: "Progress",
      content: <AdminMilestoneManager milestones={milestones} onStatusChange={changeMilestoneStatus} />,
    },
    {
      key: "deliverables",
      label: "Deliverables",
      content: (
        <AdminDeliverablesManager deliverables={deliverables} milestones={milestones} onAdd={createDeliverable} onRemove={deleteDeliverable} />
      ),
    },
    {
      key: "notes",
      label: "Notes",
      content: (
        <NotesThread
          notes={notes}
          authors={authors}
          currentUserId={user.id}
          currentUserRole="admin"
          onSubmit={submitNote}
          placeholder="Reply to your client…"
        />
      ),
    },
    {
      key: "internal",
      label: "Internal notes",
      content: (
        <NotesThread
          notes={internalNotes}
          authors={authors}
          currentUserId={user.id}
          currentUserRole="admin"
          onSubmit={submitInternalNote}
          placeholder="Leave a note for your team…"
        />
      ),
    },
    {
      key: "details",
      label: "Details",
      content: (
        <EngagementDetailsPanel
          engagement={engagement}
          intakeEmail={client?.intake_email ?? null}
          serviceSummary={`This engagement covers ${engagement.title.split("—")[0]?.trim().toLowerCase()} for ${client?.company_name ?? "the client"}, scoped under the ${engagement.package_type ?? "selected"} package.`}
        />
      ),
    },
  ];

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-secondary">
        <Link href="/admin/clients" className="hover:text-primary">
          Clients
        </Link>
        {client && (
          <>
            <ChevronRightIcon className="size-3.5" />
            <Link href={`/admin/clients/${client.id}`} className="hover:text-primary">
              {client.company_name ?? "Client"}
            </Link>
          </>
        )}
        <ChevronRightIcon className="size-3.5" />
        <span className="text-text-primary">{engagement.title}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-text-primary">{engagement.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <PackagePill packageType={engagement.package_type} />
            <StatusPill status={engagement.status} />
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab={tab} />
    </div>
  );
}
