import { cn } from "@/shared/utils/cn";
import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
};

export const IconButton = ({
  icon: Icon,
  label,
  className,
  ...props
}: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    className={cn(
      "flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--surface) text-(--fg-muted) transition-colors hover:text-(--fg)",
      className,
    )}
    {...props}
  >
    <Icon className="size-4" />
  </button>
);