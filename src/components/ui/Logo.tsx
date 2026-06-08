import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-secondary to-accent text-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c3 3.5 5 6.7 5 9.5a5 5 0 0 1-10 0C7 9.7 9 6.5 12 3Z" />
          <path d="M12 3c-3 3.5-5 6.7-5 9.5" opacity="0.4" />
        </svg>
      </span>
      <span className={cn("font-heading font-medium tracking-wide text-text-primary", sizes[size])}>Leviora</span>
    </div>
  );
}
