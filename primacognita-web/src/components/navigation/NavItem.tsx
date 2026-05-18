import { cn } from "@/shared/utils/cn";
import type { NavItemProps } from "./navItem.types";

export const NavItem = ({ item, isActive = false, danger = false, onClick }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onClick?.(item.path)}
      className={cn(
        "flex w-full items-center gap-3 py-3 text-md font-medium transition-colors",
        isActive
          ? "bg-(--sidebar-active-bg) text-(--sidebar-active-fg) -ml-4 pl-8 pr-4 rounded-r-xl"
          : danger
            ? "rounded-xl px-4 text-(--fg-muted) hover:bg-(--surface) hover:text-red-600"
            : "rounded-xl px-4 text-(--sidebar-fg) hover:bg-(--surface) hover:text-(--fg)",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </button>
  );
};