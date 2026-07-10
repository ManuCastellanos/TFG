import { createContext } from 'react';
import type { ChatConversationMember } from '@/modules/chat/domain/ChatConversation';

export type ChatDrawerState = {
  isOpen: boolean;
  activeConversationId: number | null;
  pendingUser: ChatConversationMember | null;
  open: () => void;
  close: () => void;
  selectConversation: (id: number) => void;
  openWithUser: (user: ChatConversationMember) => void;
  clearActiveConversation: () => void;
};

export const ChatDrawerContext = createContext<ChatDrawerState | null>(null);
