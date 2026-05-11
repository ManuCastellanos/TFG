import { Surface } from "@/components/ui/surface/Surface";
import { Text } from "@/components/ui/text/Text";
import { cn } from "@/shared/utils/cn";
import { progressBarClasses as c } from "./progressBar.styles";
import type { ProgressBarViewModel } from "./progressBar.types";

// ─── ProgressBar.Core — inline bar primitive ─────────────────────────────────
// Use this for compact inline progress indicators inside cards and lists.
// Use ProgressBar (below) for full-widget accessibility-ready displays.

type ProgressBarCoreProps = {
  value: number;
  /** Solid color class ("bg-emerald-400") or gradient fragment ("from-sky-300 to-sky-500") */
  colorClass?: string;
  height?: "h-1" | "h-1.5" | "h-2" | "h-3";
  className?: string;
};

function ProgressBarCore({
  value,
  colorClass = "bg-emerald-400",
  height = "h-1.5",
  className,
}: ProgressBarCoreProps) {
  const isGradient = colorClass.startsWith("from-");
  const fillClass = isGradient ? cn("bg-linear-to-r", colorClass) : colorClass;

  return (
    <div className={cn("rounded-full bg-neutral-100 overflow-hidden", height, className)} aria-hidden>
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

const ProgressBar = Object.assign(ProgressBarWidget, { Core: ProgressBarCore });

export default ProgressBar;
