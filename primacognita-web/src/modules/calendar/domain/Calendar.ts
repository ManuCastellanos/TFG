export type UnixTimestamp = number;

export interface Calendar {
  weeks: CalendarWeek[];
  periodName?: string;
}

interface CalendarWeek {
  days: CalendarDay[];
  prepadding: number[];
  postpadding: number[];
}

interface CalendarDay {
  mday: number;
  timestamp: UnixTimestamp;
  isToday: boolean;
  isWeekend: boolean;
}
