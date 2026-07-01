import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTimeNow } from '@/shared/hooks/useTimeNow';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { Button } from '@/components/ui/button/Button';
import type { PendingItem } from '../../../view-models/types';
import { PendingGroup } from './components/PendingGroup';
import { useTeacherPending, type EnrichedPendingItem } from './hooks/useTeacherPending';

type FilterId = 'todos' | 'tareas' | 'quizzes' | 'reenvios' | 'urgentes';

type Props = {
  courseId: string;
  items: PendingItem[];
};

export function TeacherPendingView({ courseId, items }: Props) {
  const navigate = useNavigate();
  const now = useTimeNow();
  const [filter, setFilter] = useState<FilterId>('todos');

  const { enriched, counts } = useTeacherPending(items, now);

  const filteredGroups = useMemo(() => {
    const filteredItems = enriched.filter((p) => {
      if (filter === 'tareas') return p.activityKind === 'assign';
      if (filter === 'quizzes') return p.activityKind === 'quiz';
      if (filter === 'reenvios') return p.subKind === 'resubmit';
      if (filter === 'urgentes') return p.urgent;
      return true;
    });

    const order: EnrichedPendingItem['age'][] = ['antiguo', 'ayer', 'hoy', 'reciente'];
    const meta: Record<string, { title: string; hint: string | null }> = {
      antiguo: { title: 'Antiguo · revisa pronto', hint: '> 24 h esperando' },
      ayer: { title: 'Ayer', hint: null },
      hoy: { title: 'Hoy', hint: null },
      reciente: { title: 'Reciente', hint: 'recién llegado' },
    };

    return order
      .map((age) => ({
        age,
        title: meta[age].title,
        hint: meta[age].hint,
        items: filteredItems.filter((p) => p.age === age),
      }))
      .filter((g) => g.items.length > 0);
  }, [enriched, filter]);

  const onItemClick = (item: EnrichedPendingItem) => {
    void navigate({
      to: '/courses/$courseId/assignment/$cmid',
      params: { courseId, cmid: String(item.cmId) },
    });
  };

  const filters: { id: FilterId; label: string; n: number; tone?: 'rose' }[] = [
    { id: 'todos', label: 'Todos', n: counts.todos },
    { id: 'tareas', label: 'Tareas', n: counts.tareas },
    { id: 'quizzes', label: 'Cuestionarios', n: counts.quizzes },
    { id: 'reenvios', label: 'Reenvíos', n: counts.reenvios },
    { id: 'urgentes', label: 'Urgentes', n: counts.urgentes, tone: 'rose' },
  ];

  const isEmpty = filteredGroups.length === 0;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-(--fg)">Por revisar</h2>
            <p className="text-sm text-(--fg-muted)">Todo lo que necesita tu atención en este curso.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-2 rounded-2xl bg-white border border-(--border) text-(--fg-muted) text-xs font-extrabold hover:bg-(--tint-50)"
            >
              Ordenar: más antiguo
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="px-3 py-2 rounded-2xl bg-white border border-(--border) text-(--fg-muted) text-xs font-extrabold hover:bg-(--tint-50)"
            >
              Descargar todo
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {filters.map((f) => {
            const isActive = filter === f.id;
            const activeCx =
              f.tone === 'rose'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-[#274E38] text-white border-[#274E38]';
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-sm transition border-2 ${
                  isActive ? activeCx : 'bg-white text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20' : 'bg-(--tint-100)'
                  }`}
                >
                  {f.n}
                </span>
              </button>
            );
          })}
        </div>

        {isEmpty ? (
          <EmptyState
            emoji="🎉"
            title="¡Al día!"
            subtitle="No hay nada que revisar con ese filtro."
          />
        ) : (
          <div className="flex flex-col gap-5">
            {filteredGroups.map((g) => (
              <PendingGroup
                key={g.age}
                title={g.title}
                hint={g.hint}
                items={g.items}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-3xl border border-(--border) p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="size-9 rounded-2xl bg-orange-100 text-orange-700 grid place-items-center text-lg">
              📥
            </div>
            <h4 className="font-extrabold text-(--fg)">Tu inbox</h4>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-extrabold text-(--fg) leading-none">{counts.todos}</span>
            <span className="text-sm font-bold text-(--fg-muted)">pendientes</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-2.5 text-center">
              <div className="text-lg font-extrabold text-(--fg)">{counts.tareas}</div>
              <div className="text-[10px] font-bold uppercase text-(--fg-subtle) mt-0.5">Tareas</div>
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-2.5 text-center">
              <div className="text-lg font-extrabold text-amber-800">{counts.quizzes}</div>
              <div className="text-[10px] font-bold uppercase text-amber-700/80 mt-0.5">Quizzes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
