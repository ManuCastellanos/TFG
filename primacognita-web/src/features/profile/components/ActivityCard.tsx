import type { ProfileActivity } from '@/modules/profile/domain/Profile';

type ActivityCardProps = {
  activities: ProfileActivity[];
};

function formatDate(ts: number): string {
  const d = new Date(ts * 1000);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return `Hoy · ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-(--border) p-6">
      <h3 className="font-extrabold text-(--fg) mb-4">Tus últimas hazañas</h3>
      {activities.length === 0 ? (
        <p className="text-sm text-(--fg-muted)">Todavía no hay actividad registrada.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {activities.map((a, i) => {
            const grade = parseFloat(a.grade);
            const max = parseFloat(a.grademax);
            const pct = max > 0 ? Math.round((grade / max) * 100) : 0;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-(--tint-50)">
                <div className="size-10 rounded-xl bg-emerald-100 grid place-items-center text-xl shrink-0">⭐</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-(--fg) truncate">
                    Calificación {grade}/{max} en &ldquo;{a.itemname}&rdquo;
                  </div>
                  <div className="text-xs text-(--fg-subtle)">{formatDate(a.dategraded)} · {pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
