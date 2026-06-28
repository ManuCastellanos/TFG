import type IMoodleUserApi from '@/shared/infrastructure/moodle/user/IMoodleUserApi';
import type IMoodleCalendarApi from '@/shared/infrastructure/moodle/calendar/IMoodleCalendarApi';
import type IMoodleRecentlyAccessedApi from '@/shared/infrastructure/moodle/recentlyAccessed/IMoodleRecentlyAccessedApi';
import type IMoodleNotificationApi from '@/shared/infrastructure/moodle/notifications/IMoodleNotificationApi';
import type IMoodleForumApi from '@/shared/infrastructure/moodle/forum/IMoodleForumApi';
import type IMoodleChatApi from '@/shared/infrastructure/moodle/chat/IMoodleChatApi';
import type IMoodleQuizApi from '@/shared/infrastructure/moodle/quiz/IMoodleQuizApi';
import type IMoodleAssignmentApi from '@/shared/infrastructure/moodle/assignment/IMoodleAssignmentApi';
import type IMoodleCourseApi from '@/shared/infrastructure/moodle/course/IMoodleCourseApi';
import type IMoodleProfileApi from '@/shared/infrastructure/moodle/profile/IMoodleProfileApi';

export default interface IPrimaCognitaApi {
  readonly user: IMoodleUserApi;
  readonly calendar: IMoodleCalendarApi;
  readonly recentlyAccessed: IMoodleRecentlyAccessedApi;
  readonly notifications: IMoodleNotificationApi;
  readonly forum: IMoodleForumApi;
  readonly chat: IMoodleChatApi;
  readonly quiz: IMoodleQuizApi;
  readonly assignment: IMoodleAssignmentApi;
  readonly course: IMoodleCourseApi;
  readonly profile: IMoodleProfileApi;
}
