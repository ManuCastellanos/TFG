import type { NavItemConfig } from "@/components/navigation/navItem/navItem.types";

export type SidebarProps = {
  navItems: NavItemConfig[];
  activePath: string;
  onNavigate: (path: string) => void;
};