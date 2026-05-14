import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useConversations() {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: queryKeys.chat.conversations(uid),
    queryFn: () => chatRepository.getConversations(token!, uid),
    enabled: !!token && !!userId,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  });
}
