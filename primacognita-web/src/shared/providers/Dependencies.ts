import MoodleClient from "../clients/MoodleClient";

import AuthRepository from "@/modules/login/infrastructure/AuthRepository";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";

export default class Dependencies {
  //Client
  readonly moodleClient: MoodleClient;
  
  //Repositories
  readonly authRepository: AuthRepository;
  readonly coursesRepository: CourseRepository;
  
  private constructor(params: {
    moodleClient: MoodleClient;
    authRepository: AuthRepository;
    courseRepository: CourseRepository;
  }) {
    this.moodleClient = params.moodleClient;
    this.authRepository = params.authRepository;
    this.coursesRepository = params.courseRepository;
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    return new Dependencies({
      moodleClient,
      authRepository: new AuthRepository(moodleClient),
      courseRepository: new CourseRepository(moodleClient),
    });
  }
}