import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSession } from '@/shared/hooks/useSession';
import { useRecentlyAccessedItems } from '@/shared/hooks/useRecentlyAccessedItems';
import { RecentlyAccessedItem } from './RecentlyAccessedItem';
import { toRecentlyAccessedItemVM } from './rAccessed.utils';
import type { RecentlyAccessedItemVM } from './RecentlyAccessed.types';

const INTERNAL_MODS = ['assign', 'quiz'];

function buildFrontendNav(
  item: RecentlyAccessedItemVM,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (INTERNAL_MODS.includes(item.modName) && item.courseId != null && item.cmId != null) {
    if (item.modName === 'quiz') {
      void navigate({
        to: '/courses/$courseId/quiz/$quizId',
        params: { courseId: String(item.courseId), quizId: String(item.cmId) },
      });
    } else {
      void navigate({
        to: '/courses/$courseId/assignment/$cmid',
        params: { courseId: String(item.courseId), cmid: String(item.cmId) },
      });
    }
  } else if (item.viewUrl) {
    window.open(item.viewUrl, '_blank');
  }
}

export function RecentlyAccessedPanel() {
  const navigate = useNavigate();
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
                onClick={() => buildFrontendNav(item, navigate)}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
