import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type BannerVariant = "success" | "warning" | "info" | "neutral";

type VariantStyles = {
  border: string;
  bg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
};

const VARIANT_MAP: Record<BannerVariant, VariantStyles> = {
  success: {
    border: "border-emerald-200",
    bg: "bg-gradient-to-br from-emerald-50 via-white to-emerald-100",
    text: "text-emerald-700",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    glow: "bg-emerald-300",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-gradient-to-br from-amber-50 via-white to-amber-100",
    text: "text-amber-700",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    glow: "bg-amber-300",
  },
  info: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 via-white to-blue-100",
    text: "text-blue-700",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    glow: "bg-blue-300",
  },
  neutral: {
    border: "border-(--border)",
    bg: "bg-(--tint-50)",
    text: "text-(--fg)",
    badgeBg: "bg-(--tint-100)",
    badgeText: "text-(--fg-muted)",
    glow: "bg-(--tint-100)",
  },
};

export type BannerProps = {
  variant?: BannerVariant;
  icon?: ReactNode;
  title?: string;
  description?: string;
  badge?: string | { text: string; color?: string };
  children?: ReactNode;
  className?: string;
};

export const Banner = ({
  variant = "neutral",
  icon,
  title,
  description,
  badge,
  children,
  className,
}: BannerProps) => {
  const v = VARIANT_MAP[variant];
  const badgeText = typeof badge === "string" ? badge : badge?.text;
  const badgeExtra = typeof badge === "object" ? badge.color : undefined;
  const hasHeader = icon || title || description || badgeText;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border-2", v.border, v.bg, className)}>
      <div className={cn("absolute top-0 -right-8 size-48 rounded-full opacity-30 blur-2xl", v.glow)} />

      <div className="relative p-6">
        {hasHeader && (
          <div className="flex items-start gap-5">
            {icon && (
              <div className={cn("size-16 rounded-3xl grid place-items-center text-4xl shadow-lg shrink-0", v.badgeBg)}>
                {icon}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {badgeText && (
                <span className={cn("inline-block text-xs font-extrabold uppercase tracking-wider rounded-full px-3 py-1 mb-2", v.badgeBg, badgeExtra ?? v.badgeText)}>
                  {badgeText}
                </span>
              )}

              {title && (
                <h2 className="text-2xl font-semibold text-(--fg) leading-tight mb-1">{title}</h2>
              )}

              {description && (
                <p className={cn("text-sm leading-relaxed", v.text)}>{description}</p>
              )}
            </div>
          </div>
        )}

        {children && <div className={cn(hasHeader && "mt-4")}>{children}</div>}
      </div>
    </div>
  );
};
