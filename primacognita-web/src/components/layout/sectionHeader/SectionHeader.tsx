import { cn } from "@/shared/utils/cn";
import type { ReactNode } from "react";

export type SectionHeaderProps = {
  title: string;
  action?: ReactNode;
  className?: string;
};

export const SectionHeader = ({
  title,
  action,
  className,
}: SectionHeaderProps) => (
  <div className={cn("flex items-center justify-between", className)}>
    <h2 className="text-2xl font-semibold text-(--fg)">{title}</h2>
    {action}
  </div>
);