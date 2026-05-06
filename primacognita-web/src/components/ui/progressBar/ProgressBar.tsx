import { Surface } from "@/components/ui/surface/Surface";
import { Text } from "@/components/ui/text/Text";
import { progressBarClasses as c } from "./progressBar.styles";
import type { ProgressBarViewModel } from "./progressBar.types";

interface Props {
  viewModel: ProgressBarViewModel;
}

export default function ProgressBar({ viewModel }: Props) {
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
