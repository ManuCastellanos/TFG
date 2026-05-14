import { useState } from 'react';
import { useSearchUsers } from '../hooks/useSearchUsers';
import { useChatDrawer } from '../useChatDrawer';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';

type NewConversationModalProps = {
  onClose: () => void;
};

export function NewConversationModal({ onClose }: NewConversationModalProps) {
  const [search, setSearch] = useState('');
  const { data: results } = useSearchUsers(search);
  const { openWithUser } = useChatDrawer();

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-3xl border border-(--border) shadow-2xl w-96 max-h-[500px] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-(--border)">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-(--fg)">Nueva conversación</h3>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-xl hover:bg-(--tint-100) grid place-items-center text-(--fg-muted)"
            >
              ✕
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar persona..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full rounded-2xl border border-(--border) bg-white pl-4 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {search.length < 2 ? (
            <p className="text-sm text-(--fg-muted) text-center py-8">
              Escribe al menos 2 caracteres para buscar
            </p>
          ) : !results || results.length === 0 ? (
            <p className="text-sm text-(--fg-muted) text-center py-8">
              Sin resultados
            </p>
          ) : (
            results.map((user) => {
              const colorIdx = user.id % SECTION_COLORS.length;
              const color = SECTION_COLORS[colorIdx];
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    openWithUser(user.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-(--tint-50) transition text-left"
                >
                  <div className="relative shrink-0">
                    {user.profileimageurl ? (
                      <img src={user.profileimageurl} alt={user.fullname} className="size-10 rounded-2xl object-cover" />
                    ) : (
                      <div className={`size-10 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold text-sm`}>
                        {user.fullname.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.isonline && (
                      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-(--fg) truncate">{user.fullname}</div>
                    <div className="text-xs text-(--fg-muted)">{user.isonline ? 'En línea' : 'Desconectado'}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
