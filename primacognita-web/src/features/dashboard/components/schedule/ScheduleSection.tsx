import { Schedule } from "./Schedule";
import type { ScheduleEntry } from "./schedule.types";

export type ScheduleSectionProps = {
  items: ScheduleEntry[];
  onItemClick?: (id: string) => void;
  onViewAll?: () => void;
};

export const ScheduleSection = ({
  items,
  onItemClick
}: ScheduleSectionProps) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <Schedule
        key={item.id}
        item={item}
        onClick={() => onItemClick?.(item.id)}
      />
    ))}
  </div>
);
