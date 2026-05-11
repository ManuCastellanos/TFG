import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';
import type { RecentlyAccessedItemVM } from '../types/recentlyAccessed.types';

const MOD_META: Record<string, { soft: string; text: string; emoji: string }> = {
  resource:    { soft: 'bg-blue-100',    text: 'text-blue-700',    emoji: '📄' },
  quiz:        { soft: 'bg-sky-100',     text: 'text-sky-700',     emoji: '🧩' },
  assign:      { soft: 'bg-violet-100',  text: 'text-violet-700',  emoji: '📝' },
  forum:       { soft: 'bg-teal-100',    text: 'text-teal-700',    emoji: '📣' },
  page:        { soft: 'bg-amber-100',   text: 'text-amber-700',   emoji: '📖' },
  url:         { soft: 'bg-green-100',   text: 'text-green-700',   emoji: '🔗' },
  lesson:      { soft: 'bg-sky-100',     text: 'text-sky-700',     emoji: '📖' },
  h5pactivity: { soft: 'bg-lime-100',    text: 'text-lime-700',    emoji: '🎨' },
  workshop:    { soft: 'bg-pink-100',    text: 'text-pink-700',    emoji: '🤝' },
};

const FALLBACK_META = [
  { soft: 'bg-orange-100', text: 'text-orange-700', emoji: '📄' },
  { soft: 'bg-violet-100', text: 'text-violet-700', emoji: '📄' },
  { soft: 'bg-blue-100',   text: 'text-blue-700',   emoji: '📄' },
  { soft: 'bg-amber-100',  text: 'text-amber-700',  emoji: '📄' },
  { soft: 'bg-teal-100',   text: 'text-teal-700',   emoji: '📄' },
];

export function toRecentlyAccessedItemVM(item: RecentItem, index: number): RecentlyAccessedItemVM {
  const meta = MOD_META[item.modName] ?? FALLBACK_META[index % FALLBACK_META.length];
  return {
    id: item.id,
    accentSoft: meta.soft,
    accentText: meta.text,
    emoji: meta.emoji,
    title: item.name,
    time: new Date(item.timeAccess * 1000).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    subtitle: item.courseName,
    viewUrl: item.viewUrl || null,
    modName: item.modName,
    courseId: item.courseId,
    cmId: item.cmId,
  };
}
