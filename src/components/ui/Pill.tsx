import { cn } from "@/lib/utils";
import type { EngagementStatus, PackageType, DocumentStatus, MilestoneStatus } from "@/types";

const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium";

const engagementStatusStyles: Record<EngagementStatus, string> = {
  active: "bg-success/20 text-[#3f7a5d]",
  review: "bg-warning/30 text-[#8a6a2a]",
  completed: "bg-primary/15 text-[#3f6f87]",
  paused: "bg-text-secondary/15 text-text-secondary",
};

const documentStatusStyles: Record<DocumentStatus, string> = {
  draft: "bg-text-secondary/15 text-text-secondary",
  reviewed: "bg-warning/30 text-[#8a6a2a]",
  approved: "bg-success/20 text-[#3f7a5d]",
  sent: "bg-primary/15 text-[#3f6f87]",
};

const milestoneStatusStyles: Record<MilestoneStatus, string> = {
  pending: "bg-text-secondary/15 text-text-secondary",
  in_progress: "bg-warning/30 text-[#8a6a2a]",
  complete: "bg-success/20 text-[#3f7a5d]",
};

const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  complete: "Complete",
};

const packageStyles: Record<PackageType, string> = {
  alacarte: "bg-accent/60 text-[#3f6f87]",
  starter: "bg-secondary/40 text-[#3f6f87]",
  growth: "bg-primary/20 text-[#3f6f87]",
  elevated: "bg-text-primary/10 text-text-primary",
};

const packageLabels: Record<PackageType, string> = {
  alacarte: "À la carte",
  starter: "Starter",
  growth: "Growth",
  elevated: "Elevated",
};

const statusLabels: Record<EngagementStatus, string> = {
  active: "Active",
  review: "In review",
  completed: "Completed",
  paused: "Paused",
};

const documentStatusLabels: Record<DocumentStatus, string> = {
  draft: "Draft",
  reviewed: "Reviewed",
  approved: "Approved",
  sent: "Sent",
};

export function StatusPill({ status, className }: { status: EngagementStatus; className?: string }) {
  return <span className={cn(baseClasses, engagementStatusStyles[status], className)}>{statusLabels[status]}</span>;
}

export function PackagePill({ packageType, className }: { packageType: PackageType | null; className?: string }) {
  if (!packageType) return null;
  return <span className={cn(baseClasses, packageStyles[packageType], className)}>{packageLabels[packageType]}</span>;
}

export function DocumentStatusPill({ status, className }: { status: DocumentStatus; className?: string }) {
  return <span className={cn(baseClasses, documentStatusStyles[status], className)}>{documentStatusLabels[status]}</span>;
}

export function MilestoneStatusPill({ status, className }: { status: MilestoneStatus; className?: string }) {
  return <span className={cn(baseClasses, milestoneStatusStyles[status], className)}>{milestoneStatusLabels[status]}</span>;
}
