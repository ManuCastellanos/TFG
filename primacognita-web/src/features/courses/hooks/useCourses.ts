import { isTeacherRole } from '@/modules/user/domain/User';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';

export function useCourses() {
  const { token, userId, roleName } = useSession();
  const { courses, loading, error } = useUserCourses(userId, token);

  return {
    courses,
    loading,
    error,
    isTeacher: isTeacherRole(roleName),
  };
}
