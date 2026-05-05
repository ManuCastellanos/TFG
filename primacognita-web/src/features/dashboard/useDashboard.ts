import { useSession } from '@/shared/hooks/useSession';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useUserCourses } from '../courses/hooks/useUserCourses';

export function useDashboard() {
  const { token, userId } = useSession();
  const { user } = useCurrentUser();
  return useUserCourses(userId ?? user?.id ?? null, token);
}
