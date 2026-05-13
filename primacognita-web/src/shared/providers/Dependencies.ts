import MoodleClient from '../clients/MoodleClient';

import AuthRepository from '@/modules/auth/infrastructure/AuthRepository';
import CourseRepository from '@/modules/course/infrastructure/CourseRepository';
import CalendarRepository from '@/modules/calendar/infrastructure/CalendarRepository';
import AuthStorage from '@/modules/auth/infrastructure/AuthStorage';
import UserRepository from '@/modules/user/infrastructure/UserRepository';
import RecentlyAccessedRepository from '@/modules/recentlyAccessed/infrastructure/RecentlyAccessedRepository';
import AssignmentRepository from '@/modules/assignment/infrastructure/AssignmentRepository';
import UserStorage from '@/modules/user/infrastructure/UserStorage';
import QuizRepository from '@/modules/quiz/infrastructure/QuizRepository';
import ForumRepository from '@/modules/forum/infrastructure/ForumRepository';

import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type IAuthRepository from '@/modules/auth/domain/IAuthRepository';
import type ICourseRepository from '@/modules/course/domain/ICourseRepository';
import type ICalendarRepository from '@/modules/calendar/domain/ICalendarRepository';
import type IAuthSessionStore from '@/modules/auth/domain/IAuthSessionStore';
import type IUserRepository from '@/modules/user/domain/IUserRepository';
import type IRecentlyAccessedRepository from '@/modules/recentlyAccessed/domain/IRecentlyAccessedRepository';
import type IAssignmentRepository from '@/modules/assignment/domain/IAssignmentRepository';
import type IUserSessionStore from '@/modules/user/domain/IUserSessionStore';
import type IQuizRepository from '@/modules/quiz/domain/IQuizRepository';
import type IForumRepository from '@/modules/forum/domain/IForumRepository';


export default class Dependencies {
  readonly moodleClient: IMoodleClient;
  readonly authRepository: IAuthRepository;
  readonly courseRepository: ICourseRepository;
  readonly calendarRepository: ICalendarRepository;
  readonly authSessionStore: IAuthSessionStore;
  readonly userRepository: IUserRepository;
  readonly recentlyAccessedRepository: IRecentlyAccessedRepository;
  readonly assignmentRepository: IAssignmentRepository;
  readonly userSessionStore: IUserSessionStore;
  readonly quizRepository: IQuizRepository;
  readonly forumRepository: IForumRepository;

  private constructor(params: {
    moodleClient: IMoodleClient;
    authRepository: IAuthRepository;
    courseRepository: ICourseRepository;
    calendarRepository: ICalendarRepository;
    authSessionStore: IAuthSessionStore;
    userRepository: IUserRepository;
    recentlyAccessedRepository: IRecentlyAccessedRepository;
    assignmentRepository: IAssignmentRepository;
    userSessionStore: IUserSessionStore;
    quizRepository: IQuizRepository;
    forumRepository: IForumRepository;
  }) {
    this.moodleClient = params.moodleClient;
    this.authRepository = params.authRepository;
    this.courseRepository = params.courseRepository;
    this.calendarRepository = params.calendarRepository;
    this.authSessionStore = params.authSessionStore;
    this.userRepository = params.userRepository;
    this.recentlyAccessedRepository = params.recentlyAccessedRepository;
    this.assignmentRepository = params.assignmentRepository;
    this.userSessionStore = params.userSessionStore;
    this.quizRepository = params.quizRepository;
    this.forumRepository = params.forumRepository;
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    return new Dependencies({
      moodleClient,
      authRepository: new AuthRepository(),
      courseRepository: new CourseRepository(moodleClient),
      calendarRepository: new CalendarRepository(moodleClient),
      authSessionStore: new AuthStorage(),
      userRepository: new UserRepository(moodleClient),
      recentlyAccessedRepository: new RecentlyAccessedRepository(moodleClient),
      assignmentRepository: new AssignmentRepository(moodleClient),
      userSessionStore: new UserStorage(),
      quizRepository: new QuizRepository(moodleClient),
      forumRepository: new ForumRepository(moodleClient),
    });
  }
}
