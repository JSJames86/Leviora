import { redirect } from "next/navigation";
import { EngagementCard } from "@/components/portal/EngagementCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { BriefcaseIcon } from "@/components/ui/icons";
import { getCurrentClient, getCurrentUser } from "@/lib/data/users";
import { getEngagementsForClient, getOnboardingStatus } from "@/lib/data/engagements";

export default async function PortalDashboardPage() {
  const user = await getCurrentUser();
  const client = await getCurrentClient();
  if (!client) redirect("/portal/onboarding");

  const { needsOnboarding } = await getOnboardingStatus(client.id);
  if (needsOnboarding) redirect("/portal/onboarding");

  const engagements = await getEngagementsForClient(client.id);
  const firstName = (user?.full_name ?? "").split(" ")[0] || "there";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-text-primary">Welcome back, {firstName}</h1>
        <p className="mt-1 text-text-secondary">Here&apos;s where things stand across your engagements with Leviora.</p>
      </div>

      {engagements.length === 0 ? (
        <EmptyState
          icon={<BriefcaseIcon className="size-6" />}
          title="No engagements yet"
          description="Once your specialist sets up your first engagement, you'll see it here with progress, deliverables, and notes."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {engagements.map((engagement) => (
            <EngagementCard key={engagement.id} engagement={engagement} />
          ))}
        </div>
      )}
    </div>
  );
}
