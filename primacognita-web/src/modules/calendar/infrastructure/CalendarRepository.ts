import type ICalendarRepository from '../domain/ICalendarRepository';
import type ICalendarApi from '../domain/ICalendarApi';
import type { Calendar } from '../domain/Calendar';

export default class CalendarRepository implements ICalendarRepository {
  constructor(private readonly api: ICalendarApi) {}

  getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar> {
    return this.api.getCalendar(token, params);
  }
}
