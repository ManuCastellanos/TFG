import { useMemo, useState } from "react";
import type { CalendarCell } from "@/components/ui/calendar/calendar.types";

export function useEventsCalendar(cells: CalendarCell[]) {
  const [hoverTs, setHoverTs] = useState<number | null>(null);
  const [selectedTs, setSelectedTs] = useState<number | null>(null);

  const hoveredCell = useMemo(() => {
    if (hoverTs == null) return null;
    return cells.find((c) => c.kind === "day" && c.timestamp === hoverTs) ?? null;
  }, [cells, hoverTs]);

  const selectedCell = useMemo(() => {
    if (selectedTs == null) return null;
    return cells.find((c) => c.kind === "day" && c.timestamp === selectedTs) ?? null;
  }, [cells, selectedTs]);

  return {
    hoveredCell,
    selectedCell,
    onHover: (ts: number | null) => setHoverTs(ts),
    onSelect: (ts: number | null) => setSelectedTs(ts),
  };
}