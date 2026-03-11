import type { LucideIcon } from "lucide-react";

export type StatItem = {
  id: string;
  icon: LucideIcon;
  value: number | string;
  label?: string;
};

export type QuickStatsRowProps = {
  stats: StatItem[];
};