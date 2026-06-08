"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { CheckCircleIcon, AlertIcon } from "@/components/ui/icons";
import type { DocumentStatus } from "@/types";

type ReviewAction = "approve" | "request_revision";

export function AdminDocumentReviewPanel({ documentId, status }: { documentId: string; status: DocumentStatus }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<ReviewAction | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(actionType: ReviewAction) {
    setError(null);
    setAction(actionType);
    startTransition(async () => {
      const response = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, action: actionType, note: note.trim() || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Couldn't update the document — please try again.");
        setAction(null);
        return;
      }
      setNote("");
      router.refresh();
    });
  }

  if (status === "approved" || status === "sent") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-[#3f7a5d]">
        <CheckCircleIcon className="size-5 shrink-0" />
        This document has been approved and delivered to the client.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Textarea
        label="Internal note (optional)"
        placeholder="Add context for your team — e.g. what needs fixing before this goes out…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => submit("approve")} loading={pending && action === "approve"}>
          <CheckCircleIcon className="size-4" />
          Approve & deliver
        </Button>
        <Button variant="secondary" onClick={() => submit("request_revision")} loading={pending && action === "request_revision"}>
          <AlertIcon className="size-4" />
          Request revision
        </Button>
      </div>
    </div>
  );
}
