import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max,
  className,
  trackClassName,
}: {
  value: number;
  max: number;
  className?: string;
  trackClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={cn("h-2 w-full rounded-full bg-border overflow-hidden", trackClassName)}>
      <div
        className={cn("h-full rounded-full bg-primary transition-[width] duration-500 ease-out", className)}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
}
