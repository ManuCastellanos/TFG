import type ICalendarRepository from '../domain/ICalendarRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { Calendar } from '../domain/Calendar';

export default class CalendarRepository implements ICalendarRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar> {
    return this.api.calendar.getCalendar(token, params);
  }
}
