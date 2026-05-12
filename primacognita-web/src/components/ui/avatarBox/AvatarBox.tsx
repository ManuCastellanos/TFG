import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type GradientToken = "emerald" | "violet" | "sky" | "orange" | "rose" | "amber";

const GRADIENT_MAP: Record<GradientToken, string> = {
  emerald: "from-emerald-300 to-emerald-500",
  violet:  "from-violet-300 to-violet-500",
  sky:     "from-sky-300 to-sky-500",
  orange:  "from-orange-300 to-orange-500",
  rose:    "from-rose-300 to-rose-500",
  amber:   "from-amber-300 to-amber-500",
};

const SIZE_MAP = {
  "size-9":  "size-9",
  "size-10": "size-10",
  "size-12": "size-12",
  "size-14": "size-14",
} as const;

const RADIUS_MAP = {
  "rounded-xl":  "rounded-xl",
  "rounded-2xl": "rounded-2xl",
  "rounded-3xl": "rounded-3xl",
} as const;

export type AvatarBoxProps = {
  gradient: GradientToken | string;
  children: ReactNode;
  size?: keyof typeof SIZE_MAP;
  radius?: keyof typeof RADIUS_MAP;
  className?: string;
};

export function AvatarBox({
  gradient,
  children,
  size = "size-12",
  radius = "rounded-2xl",
  className,
}: AvatarBoxProps) {
  const gradClass = gradient in GRADIENT_MAP
    ? GRADIENT_MAP[gradient as GradientToken]
    : gradient;

  return (
    <div
      className={cn(
        "bg-linear-to-br grid place-items-center text-white font-extrabold shrink-0",
        gradClass,
        SIZE_MAP[size],
        RADIUS_MAP[radius],
        className,
      )}
    >
      {children}
    </div>
  );
}
