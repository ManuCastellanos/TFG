import { cn } from "@/shared/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default:  "bg-(--surface) text-(--fg-muted)",
  primary:  "bg-(--color-pr) text-white",
  success:  "bg-emerald-100 text-emerald-700",
  warning:  "bg-amber-100 text-amber-700",
  danger:   "bg-red-100 text-red-600",
};

export const Badge = ({
  children,
  variant = "default",
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);