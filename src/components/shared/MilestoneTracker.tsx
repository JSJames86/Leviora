import { cn, formatDate } from "@/lib/utils";
import { CheckCircleIcon, ClockIcon, CircleIcon, AlertIcon } from "@/components/ui/icons";
import type { Milestone } from "@/types";

const statusIcon = {
  complete: CheckCircleIcon,
  in_progress: ClockIcon,
  pending: CircleIcon,
};

const statusStyles = {
  complete: "text-success bg-success/15 border-success/30",
  in_progress: "text-[#8a6a2a] bg-warning/25 border-warning/40",
  pending: "text-text-secondary bg-text-secondary/10 border-border",
};

export function MilestoneTracker({ milestones, waitingOnClient = false }: { milestones: Milestone[]; waitingOnClient?: boolean }) {
  if (!milestones.length) {
    return <p className="text-sm text-text-secondary">Milestones will appear here once your specialist sets up the engagement plan.</p>;
  }

  return (
    <div>
      {waitingOnClient && (
        <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-warning/40 bg-warning/15 px-4 py-3">
          <AlertIcon className="mt-0.5 size-5 shrink-0 text-[#8a6a2a]" />
          <div>
            <p className="text-sm font-medium text-[#6b521f]">Waiting on you</p>
            <p className="text-sm text-[#8a6a2a]">There&apos;s an in-progress milestone — your specialist may be waiting on info from you. Check Notes if you&apos;re unsure what&apos;s needed.</p>
          </div>
        </div>
      )}

      <ol className="relative space-y-0">
        {milestones.map((milestone, index) => {
          const Icon = statusIcon[milestone.status];
          const isLast = index === milestones.length - 1;
          return (
            <li key={milestone.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-border" aria-hidden />}
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border", statusStyles[milestone.status])}>
                <Icon className="size-5" />
              </span>
              <div className="pt-1.5">
                <p className={cn("text-sm font-medium", milestone.status === "pending" ? "text-text-secondary" : "text-text-primary")}>
                  {milestone.title}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {milestone.status === "complete"
                    ? `Completed ${formatDate(milestone.completed_at)}`
                    : milestone.due_date
                      ? `Due ${formatDate(milestone.due_date)}`
                      : "No due date set"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
