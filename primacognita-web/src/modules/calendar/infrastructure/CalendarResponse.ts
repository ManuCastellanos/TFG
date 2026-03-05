export type CalendarResponse = {
  periodname?: string;
  weeks: Array<{
    prepadding: number[];
    postpadding: number[];
    days: Array<{
      mday: number;
      timestamp: number;
      istoday: boolean;
      isweekend: boolean; 
    }>;
  }>;
};