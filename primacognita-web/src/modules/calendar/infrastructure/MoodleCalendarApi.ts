import type ICalendarApi from '../domain/ICalendarApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { Calendar } from '../domain/Calendar';
import type { CalendarResponse } from './CalendarResponse';

export default class MoodleCalendarApi implements ICalendarApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getCalendar(
    token: string,
    params: { year: number; month: number; day?: number },
  ): Promise<Calendar> {
    const { year, month, day = 1 } = params;

    const response = await this.moodleClient.call<CalendarResponse>(
      token,
      'core_calendar_get_calendar_monthly_view',
      {
        year: String(year),
        month: String(month),
        day: String(day),
      },
    );

    return {
      periodName: response.periodname ?? `${month}/${year}`,
      weeks: response.weeks.map((w) => ({
        prepadding: w.prepadding ?? [],
        postpadding: w.postpadding ?? [],
        days: (w.days ?? []).map((d) => ({
          mday: d.mday,
          timestamp: d.timestamp,
          isToday: d.istoday === true,
          isWeekend: d.isweekend === true,

          events: (d.events ?? []).map((e) => ({
            id: String(e.id),
            name: e.name,
            descriptionHtml: e.description ?? null,
            timestart: e.timestart ?? d.timestamp,

            eventType: e.eventtype ?? 'unknown',
            moduleName: e.modulename ?? null,
            instance: e.instance ?? null,

            isOverdue: (e.overdue ?? 0) === 1,
            isActionEvent: (e.isactionevent ?? 0) === 1,

            url: e.url ?? null,
            viewUrl: e.viewurl ?? null,

            courseName: e.course?.fullname ?? null,
            courseViewUrl: e.course?.viewurl ?? null,
          })),
        })),
      })),
    };
  }
}
