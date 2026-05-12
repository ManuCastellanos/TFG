import type { AssignmentGrade } from '@/modules/assignment/domain/AssignmentGrade';
import type { AssignmentSubmissionStatus } from '@/modules/assignment/domain/AssignmentSubmission';

const STATUS_META: Record<AssignmentSubmissionStatus, { icon: string; label: string; classes: string }> = {
  'not-submitted': { icon: '📤', label: 'Sin enviar', classes: 'bg-orange-50 border-orange-200 text-orange-900' },
  draft:           { icon: '✏️', label: 'Borrador',   classes: 'bg-amber-50 border-amber-200 text-amber-900' },
  submitted:       { icon: '✅', label: 'Enviada · a tiempo', classes: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  late:            { icon: '⏰', label: 'Enviada · tarde',    classes: 'bg-amber-50 border-amber-200 text-amber-900' },
  graded:          { icon: '⭐', label: 'Calificada',         classes: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
};

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  if (days > 0) return `${days} d ${hours} h`;
  const mins = Math.floor((totalSecs % 3600) / 60);
  return `${hours} h ${mins} min`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

type Props = {
  submissionStatus: AssignmentSubmissionStatus;
  grade?: AssignmentGrade;
  dueDate?: number;
  cutoffDate?: number;
};

export function AssignmentStatusCards({ submissionStatus, grade, dueDate, cutoffDate }: Props) {
  const statusMeta = STATUS_META[submissionStatus];
  const now = Date.now();

  const gradeLabel = grade?.grade != null
    ? parseFloat(grade.grade).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : 'Sin calificar';

  const gradeBg = grade ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-(--tint-50) border-(--border) text-(--fg)';

  const editableUntil = cutoffDate ?? dueDate;
  const remaining = dueDate ? dueDate - now : null;
  const isLate = dueDate ? now > dueDate : false;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className={`rounded-2xl border p-4 ${statusMeta.classes}`}>
        <div className="text-2xl mb-1">{statusMeta.icon}</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Entrega</div>
        <div className="text-base font-extrabold leading-tight mt-1">{statusMeta.label}</div>
      </div>

      <div className={`rounded-2xl border p-4 ${gradeBg}`}>
        <div className="text-2xl mb-1">⭐</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-70">Calificación</div>
        <div className="text-base font-extrabold leading-tight mt-1">{gradeLabel}</div>
      </div>

      {remaining != null && !isLate ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-2xl mb-1">⏳</div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800/80">Restante</div>
          <div className="text-base font-extrabold text-emerald-900 leading-tight mt-1">{formatCountdown(remaining)}</div>
        </div>
      ) : editableUntil ? (
        <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-4">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Editable hasta</div>
          <div className="text-base font-extrabold text-(--fg) leading-tight mt-1">{formatDate(editableUntil)}</div>
        </div>
      ) : (
        <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-4">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Sin fecha límite</div>
          <div className="text-base font-extrabold text-(--fg) leading-tight mt-1">-</div>
        </div>
      )}
    </div>
  );
}
