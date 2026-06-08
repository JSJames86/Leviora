import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { PackagePill, StatusPill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowRightIcon } from "@/components/ui/icons";
import { milestoneProgress } from "@/lib/data/engagements";
import type { EngagementWithMilestones } from "@/lib/data/engagements";

export function EngagementCard({ engagement }: { engagement: EngagementWithMilestones }) {
  const { complete, total } = milestoneProgress(engagement.milestones);

  return (
    <Card className="transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
      <CardBody className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-xl font-medium text-text-primary">{engagement.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <PackagePill packageType={engagement.package_type} />
              <StatusPill status={engagement.status} />
            </div>
          </div>
          <Link
            href={`/portal/engagements/${engagement.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
          >
            View
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
            <span>Milestones</span>
            <span>
              {complete} of {total} complete
            </span>
          </div>
          <ProgressBar value={complete} max={total} />
        </div>
      </CardBody>
    </Card>
  );
}
