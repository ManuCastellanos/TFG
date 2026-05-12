import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSession } from '@/shared/hooks/useSession';
import { useRecentlyAccessedItems } from '@/shared/hooks/useRecentlyAccessedItems';
import { toRecentlyAccessedItemVM } from '../utils/recentlyAccessed.utils';
import type { RecentlyAccessedItemVM } from '../types/recentlyAccessed.types';

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

export function useRecentlyAccessed() {
  const navigate = useNavigate();
  const { token } = useSession();
  const { items } = useRecentlyAccessedItems(token);
  const viewModels = useMemo(() => items.map(toRecentlyAccessedItemVM), [items]);
  const handleItemClick = (item: RecentlyAccessedItemVM) => buildFrontendNav(item, navigate);
  return { viewModels, handleItemClick };
}
