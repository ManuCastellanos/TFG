export type CalendarEventVm = {
  id: string;
  name: string;
  timestart: number;
  descriptionHtml: string | null;
  url: string | null;
  viewUrl: string | null;
  courseName: string | null;
  eventType: string;
  isOverdue: boolean;
};

export type CalendarCell =
  | { kind: "empty"; key: string }
  | {
      kind: "day";
      key: string;
      dayOfMonth: number;
      isToday: boolean;
      timestamp: number;
      isWeekend: boolean;
      events: CalendarEventVm[];
      hasEvents: boolean;
      hasOverdue: boolean;
    };

export interface CalendarViewModel {
  title: string;
  cells: CalendarCell[];
  isFetching?: boolean;
}