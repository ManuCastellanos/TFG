import { useMemo } from 'react';
import { useSession } from '@/shared/hooks/useSession';
import { useRecentlyAccessedItems } from '@/shared/hooks/useRecentlyAccessedItems';
import { RecentlyAccessedItem } from './RecentlyAccessedItem';
import { toRecentlyAccessedItemVM } from './rAccessed.utils';

export function RecentlyAccessedPanel() {
  const { token } = useSession();
  const { items } = useRecentlyAccessedItems(token);
  const viewModels = useMemo(() => items.map(toRecentlyAccessedItemVM), [items]);

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-(--fg)">Sigue por aquí</h3>
        <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
          Ver todo
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {viewModels.length === 0 ? (
          <li className="text-sm text-(--fg-subtle) px-2 py-1">Sin actividad reciente.</li>
        ) : (
          viewModels.map((item) => (
            <li key={item.id}>
              <RecentlyAccessedItem
                item={item}
                onClick={() => {
                  if (item.viewUrl) window.open(item.viewUrl, '_blank');
                }}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
