import { cn } from "@/shared/utils/cn";

export type StepBadgeColor = "emerald" | "violet" | "sky" | "orange";

const COLOR_MAP: Record<StepBadgeColor, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  violet:  "bg-violet-100 text-violet-700",
  sky:     "bg-sky-100 text-sky-700",
  orange:  "bg-orange-100 text-orange-700",
};

const SIZE_MAP = {
  sm: "size-6 rounded-lg text-xs",
  md: "size-10 rounded-2xl text-base",
} as const;

export type StepBadgeProps = {
  step: number | string;
  color?: StepBadgeColor;
  size?: keyof typeof SIZE_MAP;
};

export function StepBadge({ step, color = "emerald", size = "md" }: StepBadgeProps) {
  return (
    <div className={cn("grid place-items-center font-extrabold shrink-0", COLOR_MAP[color], SIZE_MAP[size])}>
      {step}
    </div>
  );
}
