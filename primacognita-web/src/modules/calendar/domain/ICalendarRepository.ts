import type { Calendar } from "./Calendar";

export default interface ICalendarRepository {
  getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar>;
}