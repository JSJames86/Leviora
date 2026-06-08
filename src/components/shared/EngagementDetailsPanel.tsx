import { CopyButton } from "@/components/ui/CopyButton";
import { PackagePill, StatusPill } from "@/components/ui/Pill";
import { formatDate } from "@/lib/utils";
import { PACKAGE_LABELS } from "@/types";
import type { Engagement } from "@/types";

export function EngagementDetailsPanel({
  engagement,
  intakeEmail,
  serviceSummary,
}: {
  engagement: Engagement;
  intakeEmail: string | null;
  serviceSummary: string;
}) {
  const rows = [
    { label: "Engagement", value: engagement.title },
    { label: "Package", value: engagement.package_type ? PACKAGE_LABELS[engagement.package_type] : "—", isPill: "package" as const },
    { label: "Status", value: engagement.status, isPill: "status" as const },
    { label: "Started", value: formatDate(engagement.created_at) },
    { label: "Last updated", value: formatDate(engagement.updated_at) },
  ];

  return (
    <div className="space-y-8">
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs uppercase tracking-wide text-text-secondary">{row.label}</dt>
            <dd className="mt-1.5">
              {row.isPill === "package" && engagement.package_type ? (
                <PackagePill packageType={engagement.package_type} />
              ) : row.isPill === "status" ? (
                <StatusPill status={engagement.status} />
              ) : (
                <span className="text-sm font-medium text-text-primary">{row.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div>
        <h4 className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Service summary</h4>
        <p className="max-w-prose text-sm leading-relaxed text-text-primary">{serviceSummary}</p>
      </div>

      {intakeEmail && (
        <div>
          <h4 className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Intake email address</h4>
          <div className="flex flex-wrap items-center gap-3">
            <code className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text-primary">{intakeEmail}</code>
            <CopyButton value={intakeEmail} />
          </div>
          <p className="mt-2 max-w-prose text-xs text-text-secondary">
            Forward documents related to this engagement to the address above — Leviora will route them to the right place automatically.
          </p>
        </div>
      )}
    </div>
  );
}
