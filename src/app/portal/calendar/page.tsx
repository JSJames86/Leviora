import { redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/data/users";
import { getEngagementsForClient } from "@/lib/data/engagements";
import { CalendarView, type CalendarMilestone } from "@/components/portal/CalendarView";

export const metadata = { title: "Calendar — Leviora Portal" };

export default async function CalendarPage() {
  const client = await getCurrentClient();
  if (!client) redirect("/portal/onboarding");

  const engagements = await getEngagementsForClient(client.id);

  const milestones: CalendarMilestone[] = engagements.flatMap((eng) =>
    eng.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      status: m.status,
      engagement_id: eng.id,
      engagement_title: eng.title,
      due_date: m.due_date ?? "",
    }))
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-text-primary">Calendar</h1>
        <p className="mt-1 text-text-secondary">All your milestones and due dates across every engagement.</p>
      </div>
      <CalendarView milestones={milestones} />
    </div>
  );
}
