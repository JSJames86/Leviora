"use client";

import { useState } from "react";
import { CopyIcon, CheckCircleIcon } from "./icons";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className, label = "Copy" }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access may be unavailable — fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary",
        className
      )}
    >
      {copied ? <CheckCircleIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}
