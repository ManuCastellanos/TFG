import { createContext } from 'react';

export type ChatDrawerState = {
  isOpen: boolean;
  activeConversationId: number | null;
  openWithUserId: number | null;
  open: () => void;
  close: () => void;
  selectConversation: (id: number) => void;
  openWithUser: (userId: number) => void;
  clearActiveConversation: () => void;
  clearOpenWithUser: () => void;
};

export const ChatDrawerContext = createContext<ChatDrawerState | null>(null);
