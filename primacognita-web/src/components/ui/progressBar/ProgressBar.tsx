import { Surface } from "@/components/ui/surface/Surface";
import { Text } from "@/components/ui/text/Text";
import { cn } from "@/shared/utils/cn";
import { progressBarClasses as c } from "./progressBar.styles";
import type { ProgressBarViewModel } from "./progressBar.types";

// ─── InlineProgressBar — compact inline bar primitive ────────────────────────
// Use for compact inline progress indicators inside cards and lists.
// Use ProgressBar (below) for full-widget accessibility-ready displays.

type InlineProgressBarProps = {
  value: number;
  /** Solid color class ("bg-emerald-400") or gradient fragment ("from-sky-300 to-sky-500") */
  colorClass?: string;
  /** Track background class. Defaults to "bg-neutral-100". */
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

// ─── ProgressBar — full widget ────────────────────────────────────────────────

interface Props {
  viewModel: ProgressBarViewModel;
}

function ProgressBarWidget({ viewModel }: Props) {
  const { progress, message } = viewModel;

  return (
    <Surface className={c.root}>
      <div className={c.header}>
        <div className={c.labelWrapper}>
          <Text className={c.label}>Tu progreso</Text>
          <h3 className={c.title}>{message}</h3>
        </div>

        <div className={c.circle}>{progress}%</div>
      </div>

      <div className={c.barSection}>
        <div
          className={c.track}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={c.fill} style={{ width: `${progress}%` }} />
        </div>
        <div className={c.scaleLabels}>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </Surface>
  );
}

export default ProgressBarWidget;
