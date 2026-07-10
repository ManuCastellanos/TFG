import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

export function useConversationBetweenUsers(otherUserId: number | null) {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: ['chat', 'betweenUsers', uid, otherUserId] as const,
    queryFn: () => chatRepository.getConversationBetweenUsers(token!, uid, otherUserId!),
    enabled: !!token && !!userId && otherUserId !== null,
    staleTime: 10 * 1000,
  });
}
