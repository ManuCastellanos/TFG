export interface CalendarEvent {
  id: string;
  name: string;
  descriptionHtml: string | null;
  timestart: number;
  isOverdue: boolean;
  isActionEvent: boolean;

  viewUrl: string | null;
  url: string | null;

  eventType: string;
  moduleName: string | null;
  instance: number | null;
  courseName: string | null;
  courseViewUrl: string | null;
};
