import type ICalendarRepository from "@/modules/calendar/domain/ICalendarRepository";
import type IMoodleClient from "@/shared/clients/IMoodleClient";
import type { Calendar } from "@/modules/calendar/domain/Calendar";
import type { CalendarResponse } from "@/modules/calendar/infrastructure/CalendarResponse";

export default class CalendarRepository implements ICalendarRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getCalendar(token: string, params: { year: number; month: number; day?: number }): Promise<Calendar> {
    const { year, month, day = 1 } = params;

    const response = await this.moodleClient.call<CalendarResponse>(
      token,
      "core_calendar_get_calendar_monthly_view",
      {
        year: String(year),
        month: String(month),
        day: String(day),
      },
    );

    return {
      periodName: response.periodname,
      weeks: response.weeks.map((w) => ({
        prepadding: w.prepadding ?? [],
        postpadding: w.postpadding ?? [],
        days: (w.days ?? []).map((d) => ({
          mday: d.mday,
          timestamp: d.timestamp,
          isToday: d.istoday === true,
          isWeekend: d.isweekend === true,
        })),
      })),
    };
  }
}