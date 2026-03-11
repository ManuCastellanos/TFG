import { NavItem } from "@/components/navItem/NavItem";
import type { SidebarProps } from "./sidebar.types";

export const Sidebar = ({
  navItems,
  activePath,
  onNavigate,
}: SidebarProps) => (
  <aside className="flex h-full w-64 shrink-0 flex-col bg-(--bg) px-4 py-6">
    <div className="mb-8 flex items-center gap-2 px-4">
      <span className="text-lg font-bold tracking-tight text-(--fg)">
        Prima Cognita
      </span>
    </div>

    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isActive={activePath === item.path}
          onClick={onNavigate}
        />
      ))}
    </nav>
  </aside>
);