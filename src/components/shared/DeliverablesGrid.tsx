import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentIcon, LinkIcon, ArrowRightIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { Deliverable } from "@/types";

export function DeliverablesGrid({ deliverables }: { deliverables: Deliverable[] }) {
  if (!deliverables.length) {
    return (
      <EmptyState
        icon={<DocumentIcon className="size-6" />}
        title="No deliverables yet"
        description="Documents and links from your specialist will show up here as soon as they're ready."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {deliverables.map((deliverable) => {
        const isLink = deliverable.type === "link";
        const Icon = isLink ? LinkIcon : DocumentIcon;
        return (
          <Card key={deliverable.id}>
            <CardBody className="flex h-full flex-col justify-between gap-4 pt-6">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/50 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{deliverable.title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">Delivered {formatDate(deliverable.created_at)}</p>
                </div>
              </div>
              {deliverable.url && (
                <a
                  href={deliverable.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
                >
                  {isLink ? "Visit link" : "Download"}
                  <ArrowRightIcon className="size-4" />
                </a>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
