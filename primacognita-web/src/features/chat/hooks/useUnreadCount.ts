import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useUnreadCount() {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: queryKeys.chat.unread(uid),
    queryFn: () => chatRepository.getUnreadCount(token!, uid),
    enabled: !!token && !!userId,
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });
}
