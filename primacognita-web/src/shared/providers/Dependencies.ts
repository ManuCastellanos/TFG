import MoodleClient from "../clients/MoodleClient";

import AuthRepository from "@/modules/login/infrastructure/AuthRepository";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";
import CalendarRepository from "@/modules/calendar/infrastructure/CalendarRepository";


export default class Dependencies {
  //Client
  readonly moodleClient: MoodleClient;
  
  //Repositories
  readonly authRepository: AuthRepository;
  readonly coursesRepository: CourseRepository;
  readonly calendarRepository: CalendarRepository;
  
  private constructor(params: {
    moodleClient: MoodleClient;
    authRepository: AuthRepository;
    courseRepository: CourseRepository;
    calendarRepository: CalendarRepository;
  }) {
    this.moodleClient = params.moodleClient;
    this.authRepository = params.authRepository;
    this.coursesRepository = params.courseRepository;
    this.calendarRepository = params.calendarRepository;
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    return new Dependencies({
      moodleClient,
      authRepository: new AuthRepository(moodleClient),
      courseRepository: new CourseRepository(moodleClient),
      calendarRepository: new CalendarRepository(moodleClient),
    });
  }
}