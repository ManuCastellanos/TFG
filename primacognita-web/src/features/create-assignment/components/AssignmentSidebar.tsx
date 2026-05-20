import type { UseFormReturn } from 'react-hook-form';
import type { CreateAssignmentFormValues } from '../types/create-assignment.types';

type Props = {
  form: UseFormReturn<CreateAssignmentFormValues>;
  onCancel: () => void;
  isLoading: boolean;
  allowSubmit: boolean;
};

function formatDateShort(dt: string): string | null {
  if (!dt) return null;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

function submissionLabel(allowFile: boolean, allowText: boolean, maxFiles: number): string {
  if (allowFile && allowText) return `${maxFiles} archivo(s) + texto`;
  if (allowFile) return `${maxFiles} archivo${maxFiles !== 1 ? 's' : ''}`;
  if (allowText) return 'Texto';
  return '—';
}

export function AssignmentSidebar({ form, onCancel, isLoading, allowSubmit }: Props) {
  const { watch } = form;
  const name = watch('name');
  const intro = watch('intro');
  const dueDate = watch('dueDate');
  const maxGrade = watch('maxGrade');
  const gradePass = watch('gradePass');
  const allowFile = watch('allowFile');
  const allowText = watch('allowText');
  const maxFileSubmissions = watch('maxFileSubmissions');

  const dueDateFormatted = formatDateShort(dueDate);

  return (
    <aside className="sticky top-4 flex flex-col gap-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) px-1 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3.5 shrink-0">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Así lo verán tus alumnos
      </div>

      {/* Preview card */}
      <div className="rounded-3xl bg-white border border-(--border) overflow-hidden">
        <div className="px-4 py-3 border-b border-(--border) bg-(--tint-50) flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-300" />
          <span className="size-2.5 rounded-full bg-amber-300" />
          <span className="size-2.5 rounded-full bg-emerald-300" />
          <span className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">Vista alumno</span>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="size-10 rounded-2xl bg-violet-100 text-violet-700 grid place-items-center text-lg shrink-0">📝</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700">Tarea</div>
              <div className="font-extrabold text-(--fg) text-sm leading-tight truncate">
                {name || <span className="text-(--fg-subtle) font-normal italic">Sin nombre</span>}
              </div>
            </div>
          </div>

          {intro && (
            <p className="text-xs text-(--fg-muted) leading-relaxed mb-3 line-clamp-3">{intro}</p>
          )}

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-2">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-orange-700/80">Cierre</div>
              <div className="text-xs font-extrabold text-orange-900 leading-tight">
                {dueDateFormatted ?? '—'}
              </div>
            </div>
            <div className="rounded-xl bg-sky-50 border border-sky-200 p-2">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-sky-700/80">Sobre</div>
              <div className="text-xs font-extrabold text-sky-900 leading-tight">
                {maxGrade ? `${maxGrade} puntos` : '—'}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-[#274E38] text-white py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 opacity-60"
          >
            + Agregar entrega
          </button>
        </div>
      </div>

      {/* Quick summary */}
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Resumen rápido
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
          <span className="text-(--fg-muted) font-bold">Entrega</span>
          <span className="font-extrabold text-(--fg) text-right">{dueDateFormatted ?? '—'}</span>
          <span className="text-(--fg-muted) font-bold">Sobre</span>
          <span className="font-extrabold text-(--fg) text-right">{maxGrade ? `${maxGrade} pts` : '—'}</span>
          {typeof gradePass === 'number' && isFinite(gradePass) && (
            <>
              <span className="text-(--fg-muted) font-bold">Aprobar</span>
              <span className="font-extrabold text-(--fg) text-right">{gradePass} / {maxGrade}</span>
            </>
          )}
          <span className="text-(--fg-muted) font-bold">Entregan</span>
          <span className="font-extrabold text-(--fg) text-right">
            {submissionLabel(allowFile, allowText, maxFileSubmissions)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        form="assignment-form"
        disabled={isLoading || !allowSubmit}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#274E38] text-white py-3 font-extrabold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Creando...' : '+ Crear tarea'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full rounded-2xl border border-(--border) bg-white py-2 text-sm font-bold text-(--fg-muted) hover:bg-(--tint-50) transition-colors"
      >
        Cancelar
      </button>
    </aside>
  );
}
