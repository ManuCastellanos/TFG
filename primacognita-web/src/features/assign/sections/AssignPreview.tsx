import { Button } from '@/components/ui/button/Button';
import { RichText } from '@/components/ui/rich-text';
import type { Assignment } from '@/modules/assignment/domain/Assignment';
import { AssignmentStatusCards } from '../components/AssignmentStatusCards';
import { AssignInfoChip } from '../components/AssignInfoChip';
import { AssignCountdown } from '../components/AssignCountdown';

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
  onStartUpload: () => void;
};

export function AssignPreview({ assignment, onStartUpload }: Props) {
  const { title, description, openDate, dueDate, cutoffDate, maxFiles, maxFileSizeBytes, submissionStatus, grade } = assignment;
  const maxMb = Math.round(maxFileSizeBytes / 1024 / 1024);

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="size-12 rounded-2xl bg-violet-100 text-violet-700 grid place-items-center text-2xl shrink-0">
              📝
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-(--fg) mb-1">{title}</h2>
              {description && (
                <RichText html={description} className="text-sm text-(--fg-muted)" />
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-(--tint-50) border border-dashed border-(--border) p-5 text-center mb-5">
            <div className="text-3xl mb-2">📭</div>
            <div className="text-sm font-extrabold text-(--fg)">Aún no has entregado nada</div>
            <p className="text-xs text-(--fg-muted) mt-1">Cuando subas tu archivo, aparecerá aquí.</p>
          </div>

          <Button
            variant="primary"
            type="button"
            onClick={onStartUpload}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base shadow-sm"
          >
            + Agregar entrega
          </Button>
        </div>

        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <h3 className="font-semibold text-(--fg) mb-4">Estado de la entrega</h3>
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
        {openDate && <AssignInfoChip icon="🟢" label="Apertura" value={formatDate(openDate)} />}
        {dueDate && <AssignInfoChip icon="🔴" label="Cierre" value={formatDate(dueDate)} />}
        <AssignInfoChip icon="📎" label="Tipo" value="Subida de archivos" />
        <AssignInfoChip icon="📦" label="Máx archivos" value={`${maxFiles} · ${maxMb} MB c/u`} />
      </div>
    </div>
  );
}
