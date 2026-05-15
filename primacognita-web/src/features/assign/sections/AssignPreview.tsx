import { Button } from '@/components/ui/button/Button';
import { RichText } from '@/components/ui/rich-text/RichText';
import type { Assignment } from '@/modules/assignment/domain/Assignment';
import { AssignmentStatusCards } from '../components/AssignmentStatusCards';
import { AssignInfoChip } from '../components/AssignInfoChip';
import { AssignCountdown } from '../components/AssignCountdown';
import { useTimeNow } from '@/shared/hooks/useTimeNow';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  assignment: Assignment;
  onStartUpload: () => void;
};

export function AssignPreview({ assignment, onStartUpload }: Props) {
  const { description, openDate, dueDate, cutoffDate, maxFiles, maxFileSizeBytes, submissionStatus, grade } = assignment;
  const maxMb = Math.round(maxFileSizeBytes / 1024 / 1024);
  const now = useTimeNow();
  const isNotYetOpen = !!openDate && now < openDate;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-1">
              {description && (
                <RichText html={description} className="text-sm text-(--fg-muted)" />
              )}
            </div>
          </div>

          {isNotYetOpen ? (
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 text-center mb-5">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-sm font-extrabold text-orange-800">Entrega aún no disponible</div>
              <p className="text-xs text-orange-600 mt-1">
                Se abre el {formatDate(openDate)}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-(--tint-50) border border-dashed border-(--border) p-5 text-center mb-5">
              <div className="text-3xl mb-2">📭</div>
              <div className="text-sm font-extrabold text-(--fg)">Aún no has entregado nada</div>
              <p className="text-xs text-(--fg-muted) mt-1">Cuando subas tu archivo, aparecerá aquí.</p>
            </div>
          )}

          <Button
            variant="primary"
            type="button"
            onClick={onStartUpload}
            disabled={isNotYetOpen}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base shadow-sm"
          >
            {isNotYetOpen ? '🔒 Entrega bloqueada' : '+ Agregar entrega'}
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
