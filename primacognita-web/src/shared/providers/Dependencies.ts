import MoodleClient from '../clients/MoodleClient';
import PrimaCognitaApi from '../infrastructure/api/PrimaCognitaApi';
import MoodleUserApi from '../infrastructure/moodle/user/MoodleUserApi';
import MoodleCalendarApi from '../infrastructure/moodle/calendar/MoodleCalendarApi';
import MoodleRecentlyAccessedApi from '../infrastructure/moodle/recentlyAccessed/MoodleRecentlyAccessedApi';
import MoodleNotificationApi from '../infrastructure/moodle/notifications/MoodleNotificationApi';
import MoodleForumApi from '../infrastructure/moodle/forum/MoodleForumApi';
import MoodleChatApi from '../infrastructure/moodle/chat/MoodleChatApi';
import MoodleQuizApi from '../infrastructure/moodle/quiz/MoodleQuizApi';
import MoodleAssignmentApi from '../infrastructure/moodle/assignment/MoodleAssignmentApi';
import MoodleCourseApi from '../infrastructure/moodle/course/MoodleCourseApi';
import MoodleProfileApi from '../infrastructure/moodle/profile/MoodleProfileApi';

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
import ChatRepository from '@/modules/chat/infrastructure/ChatRepository';
import NotificationRepository from '@/modules/notifications/infrastructure/NotificationRepository';
import ProfileRepository from '@/modules/profile/infrastructure/ProfileRepository';

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
import type IChatRepository from '@/modules/chat/domain/IChatRepository';
import type INotificationRepository from '@/modules/notifications/domain/INotificationRepository';
import type IProfileRepository from '@/modules/profile/domain/IProfileRepository';


export default class Dependencies {
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
  readonly chatRepository: IChatRepository;
  readonly notificationRepository: INotificationRepository;
  readonly profileRepository: IProfileRepository;

  private constructor(params: {
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
    chatRepository: IChatRepository;
    notificationRepository: INotificationRepository;
    profileRepository: IProfileRepository;
  }) {
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
    this.chatRepository = params.chatRepository;
    this.notificationRepository = params.notificationRepository;
    this.profileRepository = params.profileRepository;
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();
    const api = new PrimaCognitaApi(
      new MoodleUserApi(moodleClient),
      new MoodleCalendarApi(moodleClient),
      new MoodleRecentlyAccessedApi(moodleClient),
      new MoodleNotificationApi(moodleClient),
      new MoodleForumApi(moodleClient),
      new MoodleChatApi(moodleClient),
      new MoodleQuizApi(moodleClient),
      new MoodleAssignmentApi(moodleClient),
      new MoodleCourseApi(moodleClient),
      new MoodleProfileApi(moodleClient),
    );

    return new Dependencies({
      authRepository: new AuthRepository(),
      courseRepository: new CourseRepository(api),
      calendarRepository: new CalendarRepository(api),
      authSessionStore: new AuthStorage(),
      userRepository: new UserRepository(api),
      recentlyAccessedRepository: new RecentlyAccessedRepository(api),
      assignmentRepository: new AssignmentRepository(api),
      userSessionStore: new UserStorage(),
      quizRepository: new QuizRepository(api),
      forumRepository: new ForumRepository(api),
      chatRepository: new ChatRepository(api),
      notificationRepository: new NotificationRepository(api),
      profileRepository: new ProfileRepository(api),
    });
  }
}
