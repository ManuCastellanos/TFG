import { useState } from 'react';
import { Button } from '@/components/ui/button/Button';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';

type Props = {
  upcoming: UpcomingAssignment[];
  loading: boolean;
  onNavigate: (cmId: number) => void;
};

export function UpcomingAssignmentsPanel({ upcoming, loading, onNavigate }: Props) {
  const [now] = useState(() => Date.now());

  if (loading || upcoming.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <h3 className="font-semibold text-(--fg) mb-3">Próximas entregas</h3>
      <div className="flex flex-col gap-2">
        {upcoming.map((a) => {
          const diffDays = Math.round((a.dueDate - now / 1000) / 86400);
          const urgent = diffDays <= 1;
          return (
            <div
              key={a.id}
              className={`flex items-start gap-3 p-3 rounded-2xl border ${
                urgent ? 'bg-rose-50 border-rose-200' : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${
                urgent ? 'bg-rose-200 text-rose-700' : 'bg-orange-200 text-orange-700'
              }`}>
                📝
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-(--fg) truncate">{a.name}</div>
                <div className={`text-xs font-bold mt-0.5 ${urgent ? 'text-rose-700' : 'text-orange-700'}`}>
                  {formatDueDate(a.dueDate, now)}
                </div>
              </div>
              <Button
                variant={urgent ? 'danger' : 'primary'}
                size="sm"
                type="button"
                onClick={() => onNavigate(a.cmId)}
                className={`text-xs px-3 py-1.5 shrink-0 ${!urgent ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
              >
                Ir
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDueDate(ts: number, now: number): string {
  const date = new Date(ts * 1000);
  const diffDays = Math.round((date.getTime() - now) / 86400000);

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays < 7) return `En ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
