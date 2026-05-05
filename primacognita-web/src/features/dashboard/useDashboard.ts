import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '../courses/hooks/useUserCourses';

export function useDashboard() {
  const { userId, token } = useSession();
  return useUserCourses(userId, token);
}
