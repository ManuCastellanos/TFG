import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useUnreadNotificationCount() {
  const { token, userId } = useSession();
  const { notificationRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: queryKeys.notifications.list(uid, 0),
    queryFn: () => notificationRepository.getNotifications(token!, uid, 0, 50),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    select: (data) => data.length,
  });
}
