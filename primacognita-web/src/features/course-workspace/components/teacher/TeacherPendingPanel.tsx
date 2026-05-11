import { useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import type { PendingItem } from '../../hooks/useTeacherStats';
import { formatRelativeDate } from '@/shared/utils/formatRelativeDate';

const MODULE_META: Record<string, { emoji: string; soft: string }> = {
  assign: { emoji: '📝', soft: 'bg-violet-100' },
  quiz: { emoji: '🧩', soft: 'bg-green-100' },
};

type Props = {
  courseId: string;
  items: PendingItem[];
};

export function TeacherPendingPanel({ courseId, items }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-(--fg)">Por revisar</h3>
        {items.length > 0 && (
          <span className="rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold px-2 py-0.5">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-(--fg-muted) text-center py-4">Sin entregas pendientes</p>
      ) : (
        <div className="flex flex-col gap-1">
          {items.slice(0, 5).map((item) => {
            const meta = MODULE_META[item.activityKind] ?? MODULE_META.assign;
            return (
              <button
                key={`${item.userId}-${item.cmId}`}
                type="button"
                onClick={() =>
                  void navigate({
                    to: '/courses/$courseId/assignment/$cmid',
                    params: { courseId, cmid: String(item.cmId) },
                  })
                }
                className="flex items-center gap-3 p-2 rounded-2xl text-left hover:bg-(--tint-50) transition"
              >
                <div className={`size-9 rounded-xl ${meta.soft} grid place-items-center text-base shrink-0`}>
                  {meta.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-(--fg) truncate">{item.activityName}</div>
                  <div className="text-xs text-(--fg-subtle) truncate">
                    {item.userName} · {item.submittedAt ? formatRelativeDate(item.submittedAt) : '—'}
                  </div>
                </div>
                <ChevronRight className="size-4 text-(--fg-muted) shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
