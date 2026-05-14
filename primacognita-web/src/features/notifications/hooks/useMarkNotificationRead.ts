import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useMarkNotificationRead() {
  const { token, userId } = useSession();
  const { notificationRepository } = useDependencies();
  const uid = Number(userId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationRepository.markAsRead(token!, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(uid, 0) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(uid, 1) });
    },
  });
}
