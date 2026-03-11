import { cn } from "@/shared/utils/cn";
import type { NavItemProps } from "./navItem.types";

export const NavItem = ({ item, isActive = false, onClick }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onClick?.(item.path)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        isActive
          ? "bg-(--fg) text-(--bg)"
          : "text-(--fg-muted) hover:bg-(--surface) hover:text-(--fg)",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.label}</span>
    </button>
  );
};