import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';
import type { RecentlyAccessedItemVM } from './RecentlyAccessed.types';

const SCHEDULE_COLORS = [
  'bg-orange-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-teal-500',
] as const;

const MOD_COLORS: Record<string, string> = {
  resource: 'bg-blue-500',
  quiz: 'bg-orange-500',
  assign: 'bg-violet-500',
  forum: 'bg-teal-500',
  page: 'bg-amber-500',
  url: 'bg-green-500',
};

export function toRecentlyAccessedItemVM(item: RecentItem, index: number): RecentlyAccessedItemVM {
  return {
    id: item.id,
    code: item.modName.slice(0, 2).toUpperCase(),
    accentColor: MOD_COLORS[item.modName] ?? SCHEDULE_COLORS[index % SCHEDULE_COLORS.length],
    title: item.name,
    time: new Date(item.timeAccess * 1000).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    subtitle: item.courseName,
    viewUrl: item.viewUrl || null,
  };
}
