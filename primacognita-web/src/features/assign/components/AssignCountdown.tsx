import { useTimeNow } from '@/shared/hooks/useTimeNow';

export function AssignCountdown({ dueDate, openDate }: { dueDate?: number; openDate?: number }) {
  const now = useTimeNow();

  // Entrega aún no abierta → cuenta atrás naranja hasta apertura
  if (openDate && now < openDate) {
    const daysUntilOpen = Math.max(0, Math.round((openDate - now) / 86400000));
    const hoursUntilOpen = Math.max(0, Math.round((openDate - now) / 3600000));
    const display = daysUntilOpen >= 1 ? `${daysUntilOpen}` : `${hoursUntilOpen}`;
    const unit = daysUntilOpen >= 1 ? 'días' : 'horas';
    const pct = Math.max(5, Math.min(95, ((openDate - now) / Math.max(openDate - (now - 86400000 * 30), 1)) * 100));

    return (
      <div className="rounded-2xl border px-4 py-3 bg-orange-50 text-orange-800 border-orange-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">🔒</span>
          <span className="text-xs font-extrabold uppercase tracking-wider">Se abre en</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold">{display}</span>
          <span className="text-sm font-bold">{unit}</span>
        </div>
        <div className="h-1.5 mt-2 bg-white/60 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-orange-400" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  if (!dueDate) return null;

  const totalDays = openDate ? Math.round((dueDate - openDate) / 86400000) : 14;
  const daysLeft = Math.max(0, Math.round((dueDate - now) / 86400000));
  const urgent = daysLeft <= 1;
  const pct = Math.max(0, Math.min(100, (daysLeft / Math.max(totalDays, 1)) * 100));
  const tone = urgent
    ? 'bg-rose-100 text-rose-800 border-rose-200'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">{urgent ? '⏰' : '🗓️'}</span>
        <span className="text-xs font-extrabold uppercase tracking-wider">
          {urgent ? '¡Casi se acaba!' : 'Tiempo para entregarlo'}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold">{daysLeft}</span>
        <span className="text-sm font-bold">días</span>
        <span className="text-xs font-bold opacity-70 ml-auto">de {totalDays}</span>
      </div>
      <div className="h-1.5 mt-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${urgent ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
