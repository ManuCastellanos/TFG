import MoodleClient from "../clients/MoodleClient";

import AuthRepository from "@/modules/auth/infrastructure/AuthRepository";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";
import CalendarRepository from "@/modules/calendar/infrastructure/CalendarRepository";
import AuthStorage from "@/modules/auth/infrastructure/AuthStorage";
<<<<<<< HEAD
=======
import UserRepository from "@/modules/user/infrastructure/UserRepository";
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f

import type IMoodleClient from "@/shared/clients/IMoodleClient";
import type IAuthRepository from "@/modules/auth/domain/IAuthRepository";
import type ICourseRepository from "@/modules/course/domain/ICourseRepository";
import type ICalendarRepository from "@/modules/calendar/domain/ICalendarRepository";
import type IAuthSessionStore from "@/modules/auth/domain/IAuthSessionStore";
<<<<<<< HEAD
=======
import type IUserRepository from "@/modules/user/domain/IUserRepository";
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f

export default class Dependencies {
  readonly moodleClient: IMoodleClient;

  readonly authRepository: IAuthRepository;
  readonly courseRepository: ICourseRepository;
  readonly calendarRepository: ICalendarRepository;
  readonly authSessionStore: IAuthSessionStore;
<<<<<<< HEAD

=======
  readonly userRepository: IUserRepository;
  
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f
  private constructor(params: {
    moodleClient: IMoodleClient;
    authRepository: IAuthRepository;
    courseRepository: ICourseRepository;
    calendarRepository: ICalendarRepository;
    authSessionStore: IAuthSessionStore;
<<<<<<< HEAD
=======
    userRepository: IUserRepository;
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f
  }) {
    this.moodleClient = params.moodleClient;
    this.authRepository = params.authRepository;
    this.courseRepository = params.courseRepository;
    this.calendarRepository = params.calendarRepository;
    this.authSessionStore = params.authSessionStore;
<<<<<<< HEAD
=======
    this.userRepository = params.userRepository;
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    return new Dependencies({
      moodleClient,
      authRepository: new AuthRepository(moodleClient),
      courseRepository: new CourseRepository(moodleClient),
      calendarRepository: new CalendarRepository(moodleClient),
      authSessionStore: new AuthStorage(),
<<<<<<< HEAD
=======
      userRepository: new UserRepository(moodleClient),
>>>>>>> 812aba5703b666aff1f59e0345ad3405b36ad08f
    });
  }
}