import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useMarkAllNotificationsRead() {
  const { token, userId } = useSession();
  const { notificationRepository } = useDependencies();
  const uid = Number(userId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationRepository.markAllAsRead(token!, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
