import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useConversation(conversationId: number | null) {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: queryKeys.chat.conversation(uid, conversationId ?? 0),
    queryFn: () => chatRepository.getConversation(token!, uid, conversationId!),
    enabled: !!token && !!userId && conversationId !== null,
    staleTime: 2 * 1000,
    refetchInterval: 2 * 1000,
  });
}
