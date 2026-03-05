export type CalendarResponse = {
  periodname?: string;
  weeks: Array<{
    prepadding?: number[];
    postpadding?: number[];
    days?: Array<{
      mday: number;
      timestamp: number;
      istoday?: boolean;
      isweekend?: boolean;

      events?: Array<{
        id: number;
        name: string;

        description?: string;
        timestart?: number;
        eventtype?: string;
        modulename?: string;
        instance?: number;

        overdue?: number;
        isactionevent?: number;

        url?: string;
        viewurl?: string;

        course?: {
          fullname?: string;
          viewurl?: string;
        };
      }>;
    }>;
  }>;
};