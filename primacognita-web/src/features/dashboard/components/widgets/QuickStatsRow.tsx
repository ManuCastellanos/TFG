import { Surface } from "@/components/surface/Surface";
import type { StatItem, QuickStatsRowProps } from "./quickstatsrow.types";

const StatBadge = ({ stat }: { stat: StatItem }) => {
  const Icon = stat.icon;

  return (
    <Surface className="flex flex-1 flex-col items-center gap-1 py-3">
      <Icon className="size-4 text-(--fg-muted)" strokeWidth={1.5} />
      <span className="text-base font-bold text-(--fg)">{stat.value}</span>
      {stat.label && (
        <span className="text-[10px] text-(--fg-muted)">{stat.label}</span>
      )}
    </Surface>
  );
};

export const QuickStatsRow = ({ stats }: QuickStatsRowProps) => (
  <div className="flex gap-2">
    {stats.map((stat) => (
      <StatBadge key={stat.id} stat={stat} />
    ))}
  </div>
);