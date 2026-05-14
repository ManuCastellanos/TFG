import { use } from 'react';
import { ChatDrawerContext } from './chatContext';
import type { ChatDrawerState } from './chatContext';

export const useChatDrawer = (): ChatDrawerState => {
  const context = use(ChatDrawerContext);
  if (!context) throw new Error('useChatDrawer must be used within ChatDrawerProvider');
  return context;
};
