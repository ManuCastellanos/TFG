import type { UseFormReturn } from 'react-hook-form';
import type { CreateQuizFormValues } from '../types/create-quiz.types';

type Props = {
  form: UseFormReturn<CreateQuizFormValues>;
  onCancel: () => void;
  isLoading: boolean;
};

function formatDateShort(dt: string): string | null {
  if (!dt) return null;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTimeLimit(enabled: boolean, minutes: number): string | null {
  if (!enabled || minutes <= 0) return null;
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60} h`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${minutes} min`;
}

function formatAttempts(value: string): string {
  if (value === '0') return 'Ilimitados';
  return `${value} intento${value !== '1' ? 's' : ''}`;
}

export function QuizSidebar({ form, onCancel, isLoading }: Props) {
  const { watch } = form;
  const name = watch('name');
  const intro = watch('intro');
  const closeDate = watch('closeDate');
  const timeLimitEnabled = watch('timeLimitEnabled');
  const timeLimitCustomMinutes = watch('timeLimitCustomMinutes');
  const maxAttempts = watch('maxAttempts');
  const shuffleQuestions = watch('shuffleQuestions');

  const closeDateFormatted = formatDateShort(closeDate);
  const timeLimitLabel = formatTimeLimit(timeLimitEnabled, timeLimitCustomMinutes);

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
            <div className="size-10 rounded-2xl bg-purple-100 text-purple-700 grid place-items-center text-lg shrink-0">📋</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">Cuestionario</div>
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
                {closeDateFormatted ?? '—'}
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-2">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700/80">Tiempo</div>
              <div className="text-xs font-extrabold text-amber-900 leading-tight">
                {timeLimitLabel ?? 'Sin límite'}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-[#274E38] text-white py-2 text-xs font-extrabold flex items-center justify-center gap-1.5 opacity-60"
          >
            ▶ Iniciar cuestionario
          </button>
        </div>
      </div>

      {/* Quick summary */}
      <div className="rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 shrink-0">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Resumen rápido
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
          <span className="text-(--fg-muted) font-bold">Cierre</span>
          <span className="font-extrabold text-(--fg) text-right">{closeDateFormatted ?? '—'}</span>
          <span className="text-(--fg-muted) font-bold">Tiempo</span>
          <span className="font-extrabold text-(--fg) text-right">{timeLimitLabel ?? 'Sin límite'}</span>
          <span className="text-(--fg-muted) font-bold">Intentos</span>
          <span className="font-extrabold text-(--fg) text-right">{formatAttempts(maxAttempts)}</span>
          <span className="text-(--fg-muted) font-bold">Aleatorio</span>
          <span className="font-extrabold text-(--fg) text-right">{shuffleQuestions ? 'Sí' : 'No'}</span>
        </div>
      </div>

      <button
        type="submit"
        form="quiz-form"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#274E38] text-white py-3 font-extrabold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Creando...' : '+ Crear cuestionario'}
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
