import type { Calendar } from './Calendar';

export default interface ICalendarApi {
  getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar>;
}
