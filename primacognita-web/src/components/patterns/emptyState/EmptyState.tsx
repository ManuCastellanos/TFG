import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type EmptyStateProps = {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ emoji, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-3xl border border-(--border) bg-white p-8 text-center", className)}>
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="font-bold text-(--fg)">{title}</p>
      {subtitle && <p className="text-sm text-(--fg-muted) mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
