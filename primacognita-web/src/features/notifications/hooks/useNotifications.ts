import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { Notification } from '@/modules/notifications/domain/Notification';

export function useNotifications() {
  const { token, userId } = useSession();
  const { notificationRepository } = useDependencies();
  const uid = Number(userId);

  const unreadQuery = useQuery({
    queryKey: queryKeys.notifications.list(uid, 0),
    queryFn: () => notificationRepository.getNotifications(token!, uid, 0, 50),
    enabled: !!token && !!userId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 1,
  });

  const readQuery = useQuery({
    queryKey: queryKeys.notifications.list(uid, 1),
    queryFn: () => notificationRepository.getNotifications(token!, uid, 1, 20),
    enabled: !!token && !!userId,
    staleTime: 60 * 1000,
    retry: 1,
  });

  const unread: Notification[] = unreadQuery.data ?? [];
  const read: Notification[] = readQuery.data ?? [];

  const all = [...unread, ...read].sort((a, b) => b.timecreated - a.timecreated);

  const error = unreadQuery.error ?? readQuery.error;

  return {
    notifications: all,
    unreadCount: unread.length,
    isLoading: unreadQuery.isLoading || readQuery.isLoading,
    isError: !!error,
    errorMessage: error?.message ?? null,
  };
}
