import { useState } from 'react';
import type { Assignment } from '@/modules/assignment/domain/Assignment';
import { useAssignmentUpload } from '../hooks/useAssignmentUpload';
import { useAssignmentSubmission } from '../hooks/useAssignmentSubmission';
import { AssignmentDropzone } from '../components/AssignmentDropzone';
import { AssignCountdown } from '../components/AssignCountdown';
import { AssignInfoChip } from '../components/AssignInfoChip';
import { Banner } from '@/components/feedback/banner/Banner';
import { Button } from '@/components/ui/button/Button';
import { StepBadge } from '@/components/ui/stepBadge/StepBadge';
import { LoadingState } from '@/components/patterns/loadingState/LoadingState';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

type Props = {
  assignment: Assignment;
  onCancel: () => void;
  onSubmitted: () => void;
};

export function AssignUpload({ assignment, onCancel, onSubmitted }: Props) {
  const { id, maxFiles, maxFileSizeBytes, dueDate, cutoffDate } = assignment;
  const [note, setNote] = useState('');

  const { files, draftItemId, initializing, uploading, uploadError, addFiles, removeFile } =
    useAssignmentUpload(assignment.submission?.files?.length ? assignment.submission.files : undefined);
  const { saving, submitting, error: submitError, saveDraft, submit } = useAssignmentSubmission();

  const remaining = maxFiles - files.length;
  const canSubmit = files.length > 0 && draftItemId != null && !uploading && !submitting && !initializing;

  const handleSaveDraft = async () => {
    if (!draftItemId) return;
    await saveDraft(id, draftItemId, note || undefined);
  };

  const handleSubmit = async () => {
    if (!draftItemId) return;
    const ok = await submit(id, draftItemId, note || undefined);
    if (ok) onSubmitted();
  };

  if (initializing) {
    return <LoadingState emoji="📂" label="Cargando archivos enviados…" />;
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="flex flex-col gap-5">
        {(uploadError ?? submitError) && (
          <Banner variant="error">{uploadError ?? submitError}</Banner>
        )}

        <div className="bg-white rounded-3xl border border-(--border) p-7">
          <div className="flex items-center gap-3 mb-5">
            <StepBadge step={1} color="violet" size="md" />
            <h2 className="text-xl font-semibold text-(--fg)">Sube tus archivos</h2>
          </div>

          <AssignmentDropzone
            maxFiles={maxFiles}
            maxSizeBytes={maxFileSizeBytes}
            currentCount={files.length}
            onFilesSelected={(newFiles) => void addFiles(newFiles, maxFiles, maxFileSizeBytes)}
          />

          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-(--fg)">Archivos subidos ({files.length})</h4>
                <span className="text-xs font-bold text-(--fg-muted)">{remaining} espacios libres</span>
              </div>
              <div className="flex flex-col gap-2">
                {files.map((f) => (
                  <div key={f.file.name} className="flex items-center gap-3 p-3 rounded-2xl border border-(--border) bg-(--tint-50)">
                    <div className="size-11 rounded-xl bg-rose-100 text-rose-700 grid place-items-center text-xl shrink-0">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-sm text-(--fg) truncate">{f.file.name}</div>
                      <div className="text-xs text-(--fg-muted)">{formatSize(f.file.size)}</div>
                      <div className="h-1.5 mt-1.5 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: f.done ? '100%' : '60%' }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="size-9 rounded-xl bg-white border border-(--border) hover:bg-rose-50 hover:border-rose-200 text-(--fg-muted) hover:text-rose-700 grid place-items-center text-base"
                      aria-label={`Eliminar ${f.file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-(--border) p-6">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge step={2} color="violet" size="md" />
            <h2 className="text-xl font-semibold text-(--fg)">
              Añade una nota <span className="text-sm font-bold text-(--fg-subtle)">(opcional)</span>
            </h2>
          </div>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Algo que quieras decirle al profe sobre tu entrega?"
            className="w-full rounded-2xl border border-(--border) bg-(--tint-50) px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="lg" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="tinted"
              size="lg"
              type="button"
              disabled={!canSubmit || saving}
              onClick={() => void handleSaveDraft()}
            >
              {saving ? 'Guardando…' : 'Guardar borrador'}
            </Button>
            <Button
              size="lg"
              type="button"
              disabled={!canSubmit || submitting}
              onClick={() => void handleSubmit()}
            >
              {submitting ? 'Enviando…' : '✓ Enviar entrega'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AssignCountdown dueDate={dueDate} />
        {dueDate && <AssignInfoChip icon="🔴" label="Cierre" value={formatDate(dueDate)} />}
        {cutoffDate && <AssignInfoChip icon="🔒" label="Límite edición" value={formatDate(cutoffDate)} />}
        <div className="bg-white rounded-2xl border border-(--border) p-4">
          <h4 className="text-sm font-semibold text-(--fg) mb-2">Antes de enviar</h4>
          <ul className="text-xs text-(--fg-muted) space-y-1.5 leading-relaxed">
            <li>✅ Revisa que el archivo correcto esté arriba.</li>
            <li>✅ Pon tu nombre en la primera página.</li>
            <li>✅ Una vez enviado, podrás editarlo hasta el cierre.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
