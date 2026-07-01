import { useMemo } from 'react';
import type { PendingItem } from '../../../../view-models/types';

export type PendingAge = 'reciente' | 'hoy' | 'ayer' | 'antiguo';

export type EnrichedPendingItem = PendingItem & {
  age: PendingAge;
  urgent: boolean;
};

export type PendingGroupData = {
  age: PendingAge;
  title: string;
  hint: string | null;
  items: EnrichedPendingItem[];
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const GROUP_ORDER: PendingAge[] = ['antiguo', 'ayer', 'hoy', 'reciente'];

const GROUP_META: Record<PendingAge, { title: string; hint: string | null }> = {
  antiguo: { title: 'Antiguo · revisa pronto', hint: '> 24 h esperando' },
  ayer: { title: 'Ayer', hint: null },
  hoy: { title: 'Hoy', hint: null },
  reciente: { title: 'Reciente', hint: 'recién llegado' },
};

function classifyAge(submittedAt: number, now: number): PendingAge {
  if (submittedAt <= 0) return 'antiguo';
  const ageMs = now - submittedAt;
  if (ageMs < HOUR_MS) return 'reciente';
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();
  if (submittedAt >= startOfTodayMs) return 'hoy';
  const startOfYesterday = startOfTodayMs - DAY_MS;
  if (submittedAt >= startOfYesterday) return 'ayer';
  return 'antiguo';
}

export type UseTeacherPendingResult = {
  enriched: EnrichedPendingItem[];
  groups: PendingGroupData[];
  counts: {
    todos: number;
    tareas: number;
    quizzes: number;
    reenvios: number;
    urgentes: number;
  };
};

export function useTeacherPending(items: PendingItem[], now: number): UseTeacherPendingResult {
  return useMemo(() => {
    const enriched: EnrichedPendingItem[] = items.map((p) => {
      const age = classifyAge(p.submittedAt, now);
      return { ...p, age, urgent: age === 'antiguo' };
    });

    const groups: PendingGroupData[] = GROUP_ORDER.map((age) => ({
      age,
      title: GROUP_META[age].title,
      hint: GROUP_META[age].hint,
      items: enriched.filter((p) => p.age === age),
    })).filter((g) => g.items.length > 0);

    const counts = {
      todos: enriched.length,
      tareas: enriched.filter((p) => p.activityKind === 'assign').length,
      quizzes: enriched.filter((p) => p.activityKind === 'quiz').length,
      reenvios: enriched.filter((p) => p.subKind === 'resubmit').length,
      urgentes: enriched.filter((p) => p.urgent).length,
    };

    return { enriched, groups, counts };
  }, [items, now]);
}
