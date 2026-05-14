import type { Calendar } from '@/modules/calendar/domain/Calendar';

export default interface IMoodleCalendarApi {
  getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar>;
}
