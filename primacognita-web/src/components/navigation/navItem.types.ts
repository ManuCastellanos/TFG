import type { LucideIcon } from "lucide-react";

export type NavItemConfig = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
};

export type NavItemProps = {
  item: NavItemConfig;
  isActive?: boolean;
  danger?: boolean;
  onClick?: (path: string) => void;
};