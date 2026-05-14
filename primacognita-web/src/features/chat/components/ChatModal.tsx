import { useEffect, useRef } from 'react';
import { useChatDrawer } from '../useChatDrawer';
import { useStartConversation } from '../hooks/useStartConversation';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';

export function ChatModal() {
  const { isOpen, close, activeConversationId, openWithUserId, selectConversation } = useChatDrawer();
  const startConversation = useStartConversation();
  const processedRef = useRef<number | null>(null);

  useEffect(() => {
    if (openWithUserId && processedRef.current !== openWithUserId) {
      processedRef.current = openWithUserId;
      startConversation.mutateAsync(openWithUserId).then((result) => {
        selectConversation(result.conversationId);
      });
    }
  }, [openWithUserId, startConversation, selectConversation]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-8 py-6 pointer-events-none">
      {isOpen && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={close} />
      )}

      <div
        className={`relative bg-white rounded-3xl border border-(--border) shadow-2xl w-full max-w-5xl h-[640px] flex overflow-hidden transition-all duration-300 pointer-events-auto ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Left panel: conversation list */}
        <div className="w-80 border-r border-(--border) bg-white flex flex-col shrink-0">
          <ConversationList />
        </div>

        {/* Right panel: active conversation or placeholder */}
        <div className="flex-1 flex flex-col">
          {activeConversationId ? (
            <MessageThread />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-(--fg-muted)">
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
