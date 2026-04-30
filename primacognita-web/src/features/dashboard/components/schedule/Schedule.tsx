import { cn } from "@/shared/utils/cn";
import { Surface } from "@/components/surface/Surface";
import type { ScheduleEntry } from "./schedule.types";

export type ScheduleProps = {
  item: ScheduleEntry;
  onClick?: () => void;
};

export const Schedule = ({ item, onClick }: ScheduleProps) => (
  <Surface
    as="button"
    onClick={onClick}
    className={cn(
      "flex w-full items-center gap-4 px-4 py-3 text-left",
      "shadow-md transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-(--color-pr)",
    )}
  >
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white",
        item.accentColor,
      )}
    >
      {item.code}
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-sm font-semibold text-(--fg)">
        {item.title}
      </span>
      <span className="truncate text-xs text-(--fg-muted)">
        {item.time}
        <span className="mx-1.5 opacity-40">|</span>
        {item.subtitle}
      </span>
    </div>
  </Surface>
);
