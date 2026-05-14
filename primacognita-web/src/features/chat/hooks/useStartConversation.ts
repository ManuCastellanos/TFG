import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useChatDrawer } from '../useChatDrawer';
import { queryKeys } from '@/shared/hooks/queryKeys';

export function useStartConversation() {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const { clearOpenWithUser } = useChatDrawer();
  const uid = Number(userId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId: number) => {
      const existing = await chatRepository.getConversationBetweenUsers(token!, uid, otherUserId);
      if (existing) return { conversationId: existing.conversation.id };

      const result = await chatRepository.sendInstantMessage(token!, otherUserId, '¡Hola!');
      return { conversationId: result.conversationId };
    },
    onSuccess: () => {
      clearOpenWithUser();
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations(uid) });
    },
  });
}
