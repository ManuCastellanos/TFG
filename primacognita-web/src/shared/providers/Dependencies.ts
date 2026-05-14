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
import ChatRepository from '@/modules/chat/infrastructure/ChatRepository';
import NotificationRepository from '@/modules/notifications/infrastructure/NotificationRepository';

import MoodleCalendarApi from '@/modules/calendar/infrastructure/MoodleCalendarApi';
import MoodleRecentlyAccessedApi from '@/modules/recentlyAccessed/infrastructure/MoodleRecentlyAccessedApi';
import MoodleNotificationApi from '@/modules/notifications/infrastructure/MoodleNotificationApi';
import MoodleForumApi from '@/modules/forum/infrastructure/MoodleForumApi';
import MoodleChatApi from '@/modules/chat/infrastructure/MoodleChatApi';
import MoodleQuizApi from '@/modules/quiz/infrastructure/MoodleQuizApi';
import MoodleAssignmentApi from '@/modules/assignment/infrastructure/MoodleAssignmentApi';
import MoodleCourseApi from '@/modules/course/infrastructure/MoodleCourseApi';
import MoodleUserApi from '@/modules/user/infrastructure/MoodleUserApi';

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
  }

  static create(): Dependencies {
    const moodleClient = new MoodleClient();

    const calendarApi = new MoodleCalendarApi(moodleClient);
    const recentlyAccessedApi = new MoodleRecentlyAccessedApi(moodleClient);
    const notificationApi = new MoodleNotificationApi(moodleClient);
    const forumApi = new MoodleForumApi(moodleClient);
    const chatApi = new MoodleChatApi(moodleClient);
    const quizApi = new MoodleQuizApi(moodleClient);
    const assignmentApi = new MoodleAssignmentApi(moodleClient);
    const courseApi = new MoodleCourseApi(moodleClient);
    const userApi = new MoodleUserApi(moodleClient);

    return new Dependencies({
      authRepository: new AuthRepository(),
      courseRepository: new CourseRepository(courseApi),
      calendarRepository: new CalendarRepository(calendarApi),
      authSessionStore: new AuthStorage(),
      userRepository: new UserRepository(userApi),
      recentlyAccessedRepository: new RecentlyAccessedRepository(recentlyAccessedApi),
      assignmentRepository: new AssignmentRepository(assignmentApi),
      userSessionStore: new UserStorage(),
      quizRepository: new QuizRepository(quizApi),
      forumRepository: new ForumRepository(forumApi),
      chatRepository: new ChatRepository(chatApi),
      notificationRepository: new NotificationRepository(notificationApi),
    });
  }
}
