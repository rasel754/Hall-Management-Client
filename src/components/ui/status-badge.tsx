import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string | undefined;
  className?: string;
}

export function StatusBadge({ status = "", className }: StatusBadgeProps) {
  const normalized = status.trim().toLowerCase();

  let badgeStyles = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700";

  switch (normalized) {
    case "active":
    case "approved":
    case "resolved":
    case "available":
    case "paid":
    case "success":
      // Emerald / Green Theme
      badgeStyles = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      break;

    case "pending":
    case "in progress":
    case "in_progress":
    case "maintenance":
      // Amber / Orange Theme
      badgeStyles = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      break;

    case "rejected":
    case "cancelled":
    case "blocked":
    case "overdue":
    case "inactive":
    case "occupied":
    case "failed":
    case "urgent":
      // Red / Destructive Theme
      badgeStyles = "bg-destructive/10 text-destructive border-destructive/20";
      break;

    case "general":
    case "academic":
    case "vacant":
      // Indigo / Blue Theme
      badgeStyles = "bg-primary/10 text-primary border-primary/20";
      break;

    default:
      break;
  }

  // Capitalize first letter of each word
  const label = status
    ? status
        .split(/[_-]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Unknown";

  return (
    <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 font-semibold text-xs border ${badgeStyles} ${className || ""}`}>
      {label}
    </Badge>
  );
}
