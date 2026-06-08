"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentIcon, LinkIcon, ArrowRightIcon, TrashIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import type { Deliverable, DeliverableType, Milestone } from "@/types";

const TYPE_OPTIONS: { label: string; value: DeliverableType }[] = [
  { label: "Document", value: "document" },
  { label: "Link", value: "link" },
];

export function AdminDeliverablesManager({
  deliverables,
  milestones,
  onAdd,
  onRemove,
}: {
  deliverables: Deliverable[];
  milestones: Milestone[];
  onAdd: (input: { title: string; type: DeliverableType; url: string; milestoneId: string | null }) => Promise<{ error?: string; success?: boolean }>;
  onRemove: (deliverableId: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DeliverableType>("document");
  const [url, setUrl] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await onAdd({ title, type, url, milestoneId: milestoneId || null });
      if (result.error) {
        setError(result.error);
        return;
      }
      setTitle("");
      setUrl("");
      setMilestoneId("");
    });
  }

  function handleRemove(id: string) {
    setError(null);
    setRemovingId(id);
    startTransition(async () => {
      const result = await onRemove(id);
      if (result.error) setError(result.error);
      setRemovingId(null);
    });
  }

  return (
    <div className="space-y-8">
      {deliverables.length === 0 ? (
        <EmptyState
          icon={<DocumentIcon className="size-6" />}
          title="No deliverables yet"
          description="Add the first document or link below to share it with your client."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {deliverables.map((deliverable) => {
            const isLink = deliverable.type === "link";
            const Icon = isLink ? LinkIcon : DocumentIcon;
            return (
              <Card key={deliverable.id}>
                <CardBody className="flex h-full flex-col justify-between gap-4 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/50 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{deliverable.title}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">Added {formatDate(deliverable.created_at)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(deliverable.id)}
                      disabled={pending && removingId === deliverable.id}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-error/15 hover:text-error disabled:opacity-50"
                      aria-label={`Remove ${deliverable.title}`}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                  {deliverable.url && (
                    <a
                      href={deliverable.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
                    >
                      {isLink ? "Visit link" : "Open"}
                      <ArrowRightIcon className="size-4" />
                    </a>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <form onSubmit={handleAdd} className="space-y-4 border-t border-border pt-6">
        <h4 className="text-sm font-medium text-text-primary">Add a deliverable</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Select label="Type" options={TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value as DeliverableType)} />
          <Input label="URL" type="url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <Select
            label="Linked milestone"
            options={[{ label: "No specific milestone", value: "" }, ...milestones.map((m) => ({ label: m.title, value: m.id }))]}
            value={milestoneId}
            onChange={(e) => setMilestoneId(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" loading={pending && !removingId} disabled={!title.trim() || !url.trim()}>
            Add deliverable
          </Button>
        </div>
      </form>
    </div>
  );
}
