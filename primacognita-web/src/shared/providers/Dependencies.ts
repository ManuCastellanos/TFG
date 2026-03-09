import MoodleClient from "../clients/MoodleClient";

import AuthRepository from "@/modules/auth/infrastructure/AuthRepository";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";
import CalendarRepository from "@/modules/calendar/infrastructure/CalendarRepository";
import AuthStorage from "@/modules/auth/infrastructure/AuthStorage";

import type IMoodleClient from "@/shared/clients/IMoodleClient";
import type IAuthRepository from "@/modules/auth/domain/IAuthRepository";
import type ICourseRepository from "@/modules/course/domain/ICourseRepository";
import type ICalendarRepository from "@/modules/calendar/domain/ICalendarRepository";
import type IAuthSessionStore from "@/modules/auth/domain/IAuthSessionStore";

export default class Dependencies {
  readonly moodleClient: IMoodleClient;

  readonly authRepository: IAuthRepository;
  readonly courseRepository: ICourseRepository;
  readonly calendarRepository: ICalendarRepository;
  readonly authSessionStore: IAuthSessionStore;

  private constructor(params: {
    moodleClient: IMoodleClient;
    authRepository: IAuthRepository;
    courseRepository: ICourseRepository;
    calendarRepository: ICalendarRepository;
    authSessionStore: IAuthSessionStore;
  }) {
    this.moodleClient = params.moodleClient;
    this.authRepository = params.authRepository;
    this.courseRepository = params.courseRepository;
    this.calendarRepository = params.calendarRepository;
    this.authSessionStore = params.authSessionStore;
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    return new Dependencies({
      moodleClient,
      authRepository: new AuthRepository(moodleClient),
      courseRepository: new CourseRepository(moodleClient),
      calendarRepository: new CalendarRepository(moodleClient),
      authSessionStore: new AuthStorage(),
    });
  }
}