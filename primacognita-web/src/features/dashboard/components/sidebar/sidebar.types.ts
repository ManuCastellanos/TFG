import type { NavItemConfig } from "@/components/navItem/navItem.types";

export type SidebarProps = {
  navItems: NavItemConfig[];
  activePath: string;
  onNavigate: (path: string) => void;
};