import { useState } from 'react';
import { useSession } from '@/shared/hooks/useSession';
import { useConversations } from '../hooks/useConversations';
import { useChatDrawer } from '../useChatDrawer';
import { ConversationItem } from './ConversationItem';
import { NewConversationModal } from './NewConversationModal';

export function ConversationList() {
  const { userId } = useSession();
  const uid = userId ? Number(userId) : 0;
  const { data: conversations, isLoading } = useConversations();
  const { activeConversationId, selectConversation } = useChatDrawer();
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);

  if (!uid) return null;

  const filtered = (conversations ?? []).filter((c) => {
    if (!query) return true;
    const other = c.members.find((m) => m.id !== uid);
    const name = c.name ?? other?.fullname ?? '';
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-(--border)">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold text-(--fg)">💬 Mensajes</h2>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="size-8 rounded-xl bg-white border border-(--border) hover:bg-(--tint-100) grid place-items-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-(--fg-muted)">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="search"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-(--border) bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition"
          />
          <svg
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--fg-muted)"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-sm text-(--fg-muted) text-center">Cargando mensajes…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-(--fg-muted) text-center">
            {query ? 'Sin resultados' : 'No hay conversaciones'}
          </div>
        ) : (
          filtered.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              active={c.id === activeConversationId}
              onClick={() => selectConversation(c.id)}
              currentUserId={uid}
            />
          ))
        )}
      </div>

      {showNew && <NewConversationModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
