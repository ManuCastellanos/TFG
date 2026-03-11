import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/sectionHeader/SectionHeader";
import { IconButton } from "@/components/button/IconButton";
import { Schedule } from "./Schedule";
import type { ScheduleEntry } from "./schedule.types";

export type ScheduleSectionProps = {
  items: ScheduleEntry[];
  onItemClick?: (id: string) => void;
  onViewAll?: () => void;
};

export const ScheduleSection = ({
  items,
  onItemClick,
  onViewAll,
}: ScheduleSectionProps) => (
  <section className="flex flex-col gap-4">
    <SectionHeader
      title="Horario"
      action={
        <IconButton
          icon={ChevronRight}
          label="Ver agenda completa"
          onClick={onViewAll}
        />
      }
    />

    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Schedule
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(item.id)}
        />
      ))}
    </div>
  </section>
);
