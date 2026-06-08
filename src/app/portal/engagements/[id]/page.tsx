import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { PackagePill, StatusPill } from "@/components/ui/Pill";
import { MilestoneTracker } from "@/components/shared/MilestoneTracker";
import { DeliverablesGrid } from "@/components/shared/DeliverablesGrid";
import { NotesThread } from "@/components/shared/NotesThread";
import { EngagementDetailsPanel } from "@/components/shared/EngagementDetailsPanel";
import { ChevronRightIcon } from "@/components/ui/icons";
import { getCurrentClient, getCurrentUser } from "@/lib/data/users";
import { getEngagementDetail } from "@/lib/data/engagements";
import { addNote } from "@/lib/data/actions";

export default async function ClientEngagementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  const client = await getCurrentClient();
  if (!user || !client) redirect("/portal/onboarding");

  const detail = await getEngagementDetail(id);
  if (!detail || detail.engagement.client_id !== client.id) notFound();

  const { engagement, milestones, deliverables, notes, authors } = detail;
  const waitingOnClient = milestones.some((m) => m.status === "in_progress");

  async function submitNote(body: string) {
    "use server";
    return addNote(id, body, `/portal/engagements/${id}`);
  }

  const tabs: TabItem[] = [
    { key: "progress", label: "Progress", content: <MilestoneTracker milestones={milestones} waitingOnClient={waitingOnClient} /> },
    { key: "deliverables", label: "Deliverables", content: <DeliverablesGrid deliverables={deliverables} /> },
    {
      key: "notes",
      label: "Notes",
      content: (
        <NotesThread
          notes={notes}
          authors={authors}
          currentUserId={user.id}
          currentUserRole="client"
          onSubmit={submitNote}
          placeholder="Ask a question or share an update…"
        />
      ),
    },
    {
      key: "details",
      label: "Details",
      content: (
        <EngagementDetailsPanel
          engagement={engagement}
          intakeEmail={client.intake_email}
          serviceSummary={`This engagement covers ${engagement.title.split("—")[0]?.trim().toLowerCase()} for ${client.company_name ?? "your business"}, scoped under the ${engagement.package_type ?? "selected"} package.`}
        />
      ),
    },
  ];

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-secondary">
        <Link href="/portal" className="hover:text-primary">
          Dashboard
        </Link>
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

      <Tabs tabs={tabs} />
    </div>
  );
}
