import type IUserRepository from '@/modules/user/domain/IUserRepository';
import type { User } from '@/modules/user/domain/User';
import type {
  UserResponse,
  UserCoursesResponse,
  EnrolledUsersResponse,
} from '@/modules/user/infrastructure/UserResponse';
import type IMoodleClient from '@/shared/clients/IMoodleClient';

const TEACHER_SHORTNAMES = new Set(['editingteacher', 'teacher']);

export default class UserRepository implements IUserRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getCurrentUser(token: string): Promise<User> {
    const siteInfo = await this.moodleClient.call<UserResponse>(token, 'core_webservice_get_site_info', {});
    const { roleId, roleName } = await this.getUserRole(token, siteInfo.userid);

    return {
      id: String(siteInfo.userid),
      fullName: siteInfo.fullname,
      firstName: siteInfo.firstname,
      username: siteInfo.username,
      avatarUrl: siteInfo.userpictureurl ?? null,
      roleId,
      roleName,
    };
  }

  private async getUserRole(token: string, userId: number): Promise<{ roleId: number | null; roleName: string | null }> {
    try {
      const courses = await this.moodleClient.call<UserCoursesResponse>(token, 'core_enrol_get_users_courses', {
        userid: String(userId),
      });

      if (!courses.length) return { roleId: null, roleName: null };

      const enrolledUsers = await this.moodleClient.call<EnrolledUsersResponse>(
        token,
        'core_enrol_get_enrolled_users',
        { courseid: String(courses[0].id) },
      );

      const currentUser = enrolledUsers.find((u) => u.id === userId);
      if (!currentUser?.roles.length) return { roleId: null, roleName: null };

      const teacherRole = currentUser.roles.find((r) => TEACHER_SHORTNAMES.has(r.shortname));
      const primary = teacherRole ?? currentUser.roles[0];

      return { roleId: primary.roleid, roleName: primary.shortname };
    } catch {
      return { roleId: null, roleName: null };
    }
  }
}
