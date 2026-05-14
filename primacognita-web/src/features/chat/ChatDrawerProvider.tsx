import { useState, useCallback } from 'react';
import { ChatDrawerContext } from './chatContext';

type Props = {
  children: React.ReactNode;
};

export const ChatDrawerProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [openWithUserId, setOpenWithUserId] = useState<number | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setActiveConversationId(null);
    setOpenWithUserId(null);
  }, []);

  const selectConversation = useCallback((id: number) => {
    setActiveConversationId(id);
    setOpenWithUserId(null);
  }, []);

  const openWithUser = useCallback((userId: number) => {
    setOpenWithUserId(userId);
    setActiveConversationId(null);
    setIsOpen(true);
  }, []);

  const clearActiveConversation = useCallback(() => {
    setActiveConversationId(null);
    setOpenWithUserId(null);
  }, []);

  const clearOpenWithUser = useCallback(() => setOpenWithUserId(null), []);

  return (
    <ChatDrawerContext value={{ isOpen, activeConversationId, openWithUserId, open, close, selectConversation, openWithUser, clearActiveConversation, clearOpenWithUser }}>
      {children}
    </ChatDrawerContext>
  );
};
