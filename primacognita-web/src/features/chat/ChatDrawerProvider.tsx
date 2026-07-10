import { useState, useCallback } from 'react';
import { ChatDrawerContext } from './chatContext';
import type { ChatConversationMember } from '@/modules/chat/domain/ChatConversation';

type Props = {
  children: React.ReactNode;
};

export const ChatDrawerProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [pendingUser, setPendingUser] = useState<ChatConversationMember | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setActiveConversationId(null);
    setPendingUser(null);
  }, []);

  const selectConversation = useCallback((id: number) => {
    setActiveConversationId(id);
    setPendingUser(null);
  }, []);

  const openWithUser = useCallback((user: ChatConversationMember) => {
    setPendingUser(user);
    setActiveConversationId(null);
    setIsOpen(true);
  }, []);

  const clearActiveConversation = useCallback(() => {
    setActiveConversationId(null);
    setPendingUser(null);
  }, []);

  return (
    <ChatDrawerContext
      value={{
        isOpen,
        activeConversationId,
        pendingUser,
        open,
        close,
        selectConversation,
        openWithUser,
        clearActiveConversation,
      }}
    >
      {children}
    </ChatDrawerContext>
  );
};
