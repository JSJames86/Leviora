"use client";

import { useRef, useState, useTransition } from "react";
import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageIcon } from "@/components/ui/icons";
import { cn, formatRelativeTime, initials } from "@/lib/utils";
import type { Note, User } from "@/types";

export function NotesThread({
  notes,
  authors,
  currentUserId,
  currentUserRole,
  onSubmit,
  placeholder = "Add a note…",
}: {
  notes: Note[];
  authors: Record<string, User>;
  currentUserId: string;
  currentUserRole: "admin" | "client";
  onSubmit: (body: string) => Promise<{ error?: string; success?: boolean }>;
  placeholder?: string;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await onSubmit(body);
      if (result.error) {
        setError(result.error);
      } else {
        setBody("");
      }
    });
  }

  return (
    <div className="space-y-6">
      {notes.length === 0 ? (
        <EmptyState icon={<MessageIcon className="size-6" />} title="No notes yet" description="Start the conversation — questions, updates, or anything else." />
      ) : (
        <ol className="space-y-4">
          {notes.map((note) => {
            const author = authors[note.author_id ?? ""];
            const isAdmin = author?.role === "admin";
            const isMine = note.author_id === currentUserId;
            return (
              <li key={note.id} className={cn("flex gap-3", isMine && "flex-row-reverse")}>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    isAdmin ? "bg-primary/20 text-[#3f6f87]" : "bg-secondary/50 text-[#3f6f87]"
                  )}
                >
                  {initials(author?.full_name ?? author?.email)}
                </span>
                <div className={cn("max-w-[85%] space-y-1", isMine && "items-end text-right")}>
                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm",
                      isAdmin ? "border-primary/25 bg-primary/10 text-text-primary" : "border-border bg-surface text-text-primary",
                      isMine && "rounded-tr-sm",
                      !isMine && "rounded-tl-sm"
                    )}
                  >
                    {note.body}
                  </div>
                  <p className="px-1 text-xs text-text-secondary">
                    {author?.full_name ?? (isAdmin ? "Leviora" : "Client")} · {formatRelativeTime(note.created_at)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-6">
        <Textarea
          label={currentUserRole === "admin" ? "Reply to this thread" : "Add a note"}
          name="body"
          placeholder={placeholder}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" loading={pending} disabled={!body.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
