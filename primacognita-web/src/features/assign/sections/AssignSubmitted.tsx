import type { Assignment } from '@/modules/assignment/domain/Assignment';
import { AssignmentStatusCards } from '../components/AssignmentStatusCards';
import { AssignmentFilesList } from '../components/AssignmentFilesList';
import { AssignInfoChip } from '../components/AssignInfoChip';
import { AssignCountdown } from '../components/AssignCountdown';
import { ResultBanner } from '@/components/feedback/ResultBanner/ResultBanner';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  assignment: Assignment;
  onEdit: () => void;
};

export function AssignSubmitted({ assignment, onEdit }: Props) {
  const { title, isGraded, grade, submission, dueDate, cutoffDate, openDate, maxGrade, passGrade, submissionStatus } = assignment;

  const submittedAt = submission?.submittedAt;
  const canEdit = cutoffDate ? Date.now() < cutoffDate : dueDate ? Date.now() < dueDate : true;
  const gradeValue = grade?.grade != null ? parseFloat(grade.grade) : null;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-5">
        {isGraded && gradeValue != null ? (
          <ResultBanner
            grade={gradeValue}
            maxGrade={maxGrade}
            passGrade={passGrade}
            title={title}
            feedback={grade?.feedback}
          />
        ) : (
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-7">
            <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
              {(
                [
                  ['12%', '25%', '#10b981'], ['28%', '55%', '#8b5cf6'], ['42%', '15%', '#f59e0b'],
                  ['56%', '40%', '#ec4899'], ['72%', '22%', '#06b6d4'], ['86%', '55%', '#10b981'],
                  ['18%', '75%', '#f59e0b'], ['48%', '78%', '#8b5cf6'], ['78%', '80%', '#ec4899'],
                ] as [string, string, string][]
              ).map((c, i) => (
                <circle key={i} cx={c[0]} cy={c[1]} r={i % 2 ? 5 : 3.5} fill={c[2]} opacity="0.8" />
              ))}
            </svg>
            <div className="relative flex items-center gap-5">
              <div className="size-20 rounded-3xl bg-gradient-to-br from-emerald-300 to-emerald-600 grid place-items-center text-4xl shadow-lg shrink-0">
                ✅
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">¡Entregado!</div>
                <h2 className="text-2xl font-extrabold text-(--fg) leading-tight mb-1">{title}</h2>
                <p className="text-sm text-(--fg-muted)">
                  {submittedAt
                    ? <>Lo enviaste el <strong>{formatDate(submittedAt)}</strong>.</>
                    : 'Tu entrega ha sido registrada.'
                  }
                  {' '}Cuando el/la profe lo corrija, recibirás un aviso.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-(--fg)">Tu entrega</h3>
            {canEdit && !isGraded && (
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl hover:bg-emerald-50"
              >
                ✏️ Editar entrega
              </button>
            )}
          </div>
          {submission?.files && submission.files.length > 0 ? (
            <AssignmentFilesList files={submission.files} showDownload />
          ) : (
            <p className="text-sm text-(--fg-muted) italic">No hay archivos adjuntos.</p>
          )}
          {submission?.note && (
            <div className="mt-4 p-4 rounded-2xl bg-(--tint-50) border border-(--border)">
              <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">Tu nota al profe</div>
              <p className="text-sm text-(--fg)">{submission.note}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <h3 className="font-extrabold text-(--fg) mb-4">Estado de la entrega</h3>
          <AssignmentStatusCards
            submissionStatus={submissionStatus}
            grade={grade}
            dueDate={dueDate}
            cutoffDate={cutoffDate}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AssignCountdown dueDate={dueDate} openDate={openDate} />
        <AssignInfoChip icon="✅" label="Estado" value="Entregada" tone="success" />
        {submittedAt && <AssignInfoChip icon="📅" label="Enviada" value={formatDate(submittedAt)} />}
        {dueDate && <AssignInfoChip icon="🔴" label="Cierre" value={formatDate(dueDate)} />}
        {!isGraded && (
          <div className="bg-white rounded-2xl border border-(--border) p-4">
            <h4 className="text-sm font-extrabold text-(--fg) mb-2">¿Y ahora?</h4>
            <p className="text-xs text-(--fg-muted) leading-relaxed">
              Tu profe va a revisar la entrega.{canEdit ? ' Mientras, puedes editarla si te das cuenta de algo.' : ''} Te avisaremos cuando esté calificada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
