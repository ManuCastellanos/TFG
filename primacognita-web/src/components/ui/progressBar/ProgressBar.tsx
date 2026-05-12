import { cn } from "@/shared/utils/cn";

type InlineProgressBarProps = {
  value: number;
  colorClass?: string;
  trackClass?: string;
  height?: "h-1" | "h-1.5" | "h-2" | "h-3";
  className?: string;
};

export function InlineProgressBar({
  value,
  colorClass = "bg-emerald-400",
  trackClass = "bg-neutral-100",
  height = "h-1.5",
  className,
}: InlineProgressBarProps) {
  const isGradient = colorClass.startsWith("from-");
  const fillClass = isGradient ? cn("bg-linear-to-r", colorClass) : colorClass;

  return (
    <div className={cn("rounded-full overflow-hidden", trackClass, height, className)} aria-hidden>
      <div
        className={cn("h-full rounded-full transition-all", fillClass)}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
