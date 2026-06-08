"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";
import type { Milestone, MilestoneStatus } from "@/types";

const STATUS_OPTIONS: { label: string; value: MilestoneStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Complete", value: "complete" },
];

function MilestoneRow({
  milestone,
  onStatusChange,
}: {
  milestone: Milestone;
  onStatusChange: (milestoneId: string, status: MilestoneStatus) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(status: MilestoneStatus) {
    setError(null);
    startTransition(async () => {
      const result = await onStatusChange(milestone.id, status);
      if (result.error) setError(result.error);
    });
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-text-primary">{milestone.title}</p>
        <p className="mt-0.5 text-xs text-text-secondary">
          {milestone.status === "complete"
            ? `Completed ${formatDate(milestone.completed_at)}`
            : milestone.due_date
              ? `Due ${formatDate(milestone.due_date)}`
              : "No due date set"}
        </p>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
      <div className="w-full sm:w-48">
        <Select
          aria-label={`Status for ${milestone.title}`}
          options={STATUS_OPTIONS}
          value={milestone.status}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value as MilestoneStatus)}
        />
      </div>
    </li>
  );
}

export function AdminMilestoneManager({
  milestones,
  onStatusChange,
}: {
  milestones: Milestone[];
  onStatusChange: (milestoneId: string, status: MilestoneStatus) => Promise<{ error?: string; success?: boolean }>;
}) {
  if (!milestones.length) {
    return <p className="text-sm text-text-secondary">No milestones have been set up for this engagement yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {milestones.map((milestone) => (
        <MilestoneRow key={milestone.id} milestone={milestone} onStatusChange={onStatusChange} />
      ))}
    </ul>
  );
}
