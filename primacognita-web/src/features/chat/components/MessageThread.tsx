import { useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { Alert } from '@/components/ui/alert/Alert';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import { useConversation } from '../hooks/useConversation';
import { useChatDrawer } from '../useChatDrawer';
import { MessageBubble } from './MessageBubble';
import { ChatComposer } from './ChatComposer';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';

export function MessageThread() {
  const { userId, token } = useSession();
  const { chatRepository } = useDependencies();
  const queryClient = useQueryClient();
  const uid = userId ? Number(userId) : 0;
  const { activeConversationId, clearActiveConversation } = useChatDrawer();
  const { data, isLoading, isError, error } = useConversation(activeConversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeConversationId || !token) return;
    chatRepository.markConversationAsRead(token, uid, activeConversationId).catch(() => {});

    queryClient.setQueryData(queryKeys.chat.conversation(uid, activeConversationId), (old: any) => {
      if (!old?.conversation) return old;
      return { ...old, conversation: { ...old.conversation, unreadcount: 0 } };
    });

    queryClient.setQueryData(queryKeys.chat.conversations(uid), (old: any) => {
      if (!old) return old;
      return old.map((c: any) =>
        c.id === activeConversationId ? { ...c, unreadcount: 0 } : c,
      );
    });

    queryClient.invalidateQueries({ queryKey: queryKeys.chat.unread(uid) });
  }, [activeConversationId, token, uid, chatRepository, queryClient]);

  const conversation = data?.conversation;
  const messages = useMemo(() => data?.messages ?? [], [data?.messages]);
  const otherMember = conversation?.members.find((m) => m.id !== uid) ?? conversation?.members[0];

  const displayName = conversation?.name || otherMember?.fullname || 'Usuario';
  const initials = displayName
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const colorIdx = (otherMember?.id ?? 0) % SECTION_COLORS.length;
  const color = SECTION_COLORS[colorIdx];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  if (isError) {
    return (
      <div className="flex-1 p-5">
        <Alert variant="error">Error cargando mensajes: {String(error)}</Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-(--fg-muted)">
        Cargando mensajes…
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-(--border)">
        <button
          type="button"
          onClick={clearActiveConversation}
          className="size-9 rounded-xl bg-(--tint-50) hover:bg-(--tint-100) grid place-items-center text-(--fg-muted) shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="relative">
          {otherMember?.profileimageurl ? (
            <img src={otherMember.profileimageurl} alt={displayName} className="size-11 rounded-2xl object-cover shadow-sm" />
          ) : (
            <div className={`size-11 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold shadow-sm`}>
              {initials}
            </div>
          )}
          {otherMember?.isonline && (
            <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-400 border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-(--fg)">{displayName}</div>
          <div className="text-xs text-emerald-700 font-bold">
            {otherMember?.isonline ? '● En línea' : otherMember?.showonlinestatus ? 'Desconectado' : ''}
            {conversation?.membercount && conversation.membercount > 2 ? ` · ${conversation.membercount} miembros` : ''}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-(--tint-50)/30 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-(--fg-muted)">
            No hay mensajes. Envía el primero.
          </div>
        ) : (
          messages
            .slice()
            .reverse()
            .map((m, i) => {
              const isMine = m.useridfrom === uid;
              const prev = i > 0 ? messages[messages.length - i] : null;
              const showAvatar = !isMine && (i === 0 || prev?.useridfrom !== m.useridfrom);
              return (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMine={isMine}
                  member={otherMember}
                  showAvatar={showAvatar}
                />
              );
            })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      {conversation?.cansendmessagetoconversation !== false && (
        <ChatComposer conversationId={activeConversationId!} />
      )}
    </div>
  );
}
