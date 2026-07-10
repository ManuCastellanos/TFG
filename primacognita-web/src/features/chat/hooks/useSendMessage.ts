import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

type SendTarget = { conversationId: number } | { otherUserId: number };

export function useSendMessage(target: SendTarget) {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);
  const queryClient = useQueryClient();
  const conversationId = 'conversationId' in target ? target.conversationId : null;

  return useMutation({
    mutationFn: async (text: string) => {
      if ('conversationId' in target) {
        const message = await chatRepository.sendMessage(token!, target.conversationId, text);
        return { conversationId: target.conversationId, message };
      }
      return chatRepository.sendInstantMessage(token!, target.otherUserId, text);
    },

    onMutate: async (text) => {
      if (conversationId == null) return undefined;

      await queryClient.cancelQueries({ queryKey: queryKeys.chat.conversation(uid, conversationId) });
      type ConvData = { conversation: unknown; messages: { id: number; useridfrom: number; text: string; timecreated: number }[] };
      const previous = queryClient.getQueryData<ConvData>(queryKeys.chat.conversation(uid, conversationId));

      const optimisticMsg = {
        id: Date.now(),
        useridfrom: uid,
        text,
        timecreated: Math.floor(Date.now() / 1000),
      };

      if (previous) {
        queryClient.setQueryData(queryKeys.chat.conversation(uid, conversationId), {
          ...previous,
          messages: [...previous.messages, optimisticMsg],
        });
      } else {
        queryClient.setQueryData(queryKeys.chat.conversation(uid, conversationId), {
          conversation: null as any,
          messages: [optimisticMsg],
        });
      }

      queryClient.setQueryData(queryKeys.chat.conversations(uid), (old: any) => {
        if (!old) return old;
        return old.map((c: any) =>
          c.id === conversationId
            ? { ...c, lastMessage: { id: Date.now(), useridfrom: uid, text, timecreated: Math.floor(Date.now() / 1000) } }
            : c,
        );
      });

      return { previous };
    },

    onError: (_err, _text, context) => {
      if (conversationId != null && context?.previous) {
        queryClient.setQueryData(queryKeys.chat.conversation(uid, conversationId), context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unread(uid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations(uid) });
    },
  });
}
