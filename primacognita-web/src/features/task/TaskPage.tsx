import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Play, CalendarClock, Trophy } from 'lucide-react';
import { Banner } from '@/components/feedback/banner/Banner';
import { Button } from '@/components/ui/button/Button';
import { Text } from '@/components/ui/text/Text';
import { Card } from '@/components/ui/card/Card';
import { useTask } from './hooks/useTask';
import { useQuizPreview } from '@/features/quiz/hooks/useQuizPreview';
import type { UserAttempt } from '@/modules/quiz/domain/IQuizRepository';

const formatDate = (date: Date) =>
  date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatGrade = (value: number) =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDuration = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m} min ${s} s`;
};

// ─── Info chip ────────────────────────────────────────────────────────────────

const InfoChip = ({
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: string;
  label: string;
  value: string;
  tone?: 'neutral' | 'warning' | 'success';
}) => {
  const tones = {
    neutral: 'bg-(--tint-50) text-(--fg) border-(--border)',
    warning: 'bg-orange-50 text-orange-800 border-orange-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 ${tones[tone]}`}>
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</div>
        <div className="text-sm font-extrabold">{value}</div>
      </div>
    </div>
  );
};

// ─── Countdown ────────────────────────────────────────────────────────────────

const Countdown = ({ dueDate, openDate }: { dueDate?: Date; openDate?: Date }) => {
  if (!dueDate) return null;

  const now = Date.now();
  const total = openDate ? Math.round((dueDate.getTime() - openDate.getTime()) / 86400000) : 14;
  const daysLeft = Math.max(0, Math.round((dueDate.getTime() - now) / 86400000));
  const urgent = daysLeft <= 1;
  const tone = urgent
    ? 'bg-rose-100 text-rose-800 border-rose-200'
    : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  const pct = Math.max(0, Math.min(100, (daysLeft / total) * 100));

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
        <span className="text-xs font-bold opacity-70 ml-auto">de {total}</span>
      </div>
      <div className="h-1.5 mt-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${urgent ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Quiz preview — with previous attempts (results design) ──────────────────

function QuizPreviewWithAttempts({
  courseId,
  task,
  attempts,
  onStart,
}: {
  courseId: string;
  task: NonNullable<ReturnType<typeof useTask>['task']>;
  attempts: UserAttempt[];
  onStart: () => void;
}) {
  const navigate = useNavigate();

  const passGrade = task.gradePass ?? task.gradeMax * 0.5;

  const bestAttempt = attempts.reduce<UserAttempt | null>((b, a) =>
    b == null || (a.sumGrades ?? 0) > (b.sumGrades ?? 0) ? a : b
  , null);
  const displayGrade = bestAttempt?.sumGrades ?? null;
  const passed = displayGrade != null && displayGrade >= passGrade;
  const pct = displayGrade != null ? Math.round((displayGrade / task.gradeMax) * 100) : null;

  const normalizeGrade = (sumGrades: number | null): number | null => sumGrades;

  return (
    <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          className="grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-(--tint-50) transition"
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-14 rounded-2xl bg-orange-100 grid place-items-center text-2xl shrink-0">✏️</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Cuestionario</span>
          <h1 className="text-2xl font-extrabold text-(--fg) leading-tight truncate">{task.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Celebration card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-amber-50 p-7">
            <svg viewBox="0 0 800 200" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
              {(
                [
                  ['8%', '20%', '#10b981'], ['15%', '55%', '#f59e0b'], ['22%', '10%', '#ec4899'],
                  ['32%', '70%', '#8b5cf6'], ['44%', '25%', '#06b6d4'], ['56%', '65%', '#10b981'],
                  ['66%', '12%', '#f59e0b'], ['76%', '45%', '#ec4899'], ['86%', '28%', '#8b5cf6'],
                  ['94%', '72%', '#10b981'], ['5%', '80%', '#f59e0b'], ['28%', '88%', '#06b6d4'],
                  ['50%', '82%', '#ec4899'], ['70%', '85%', '#8b5cf6'], ['88%', '90%', '#10b981'],
                ] as [string, string, string][]
              ).map((c, i) => (
                <circle key={i} cx={c[0]} cy={c[1]} r={i % 3 === 0 ? 6 : 4} fill={c[2]} opacity="0.75" />
              ))}
            </svg>
            <div className="relative flex items-center gap-5">
              <div className="size-20 rounded-3xl bg-linear-to-br from-emerald-300 to-emerald-600 grid place-items-center text-4xl shadow-lg shrink-0">
                {passed ? '👍' : '💪'}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
                  {passed ? '¡Bien hecho!' : '¡Sigue intentándolo!'}
                </div>
                <h2 className="text-2xl font-extrabold text-(--fg) leading-tight mb-2">
                  {passed ? 'Has aprobado el cuestionario' : 'No has llegado a la nota mínima'}
                </h2>
                {displayGrade != null && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-emerald-700 leading-none">
                      {formatGrade(displayGrade)}
                    </span>
                    <span className="text-xl font-bold text-(--fg-muted)">/ {formatGrade(task.gradeMax)}</span>
                    {pct != null && (
                      <span className={`text-sm font-extrabold rounded-full px-3 py-1 ml-1 ${
                        passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {pct}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attempts list */}
          <div className="bg-white rounded-3xl border border-(--border) p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-(--fg)">Tus intentos</h3>
              <span className="text-xs font-bold text-(--fg-subtle)">
                {attempts.length} {attempts.length === 1 ? 'intento' : 'intentos'} · te quedan ilimitados
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[...attempts].reverse().map((a) => {
                const score = normalizeGrade(a.sumGrades);
                const attemptPassed = score != null && score >= passGrade;
                const isBest = bestAttempt?.id === a.id;
                const started = new Date(a.timeStart * 1000).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const duration = a.timeFinish > 0
                  ? formatDuration(a.timeFinish - a.timeStart)
                  : '—';
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                      isBest ? 'border-emerald-200 bg-emerald-50/50' : 'border-(--border) hover:bg-(--tint-50)'
                    }`}
                  >
                    <div className={`size-9 rounded-xl grid place-items-center font-extrabold text-sm shrink-0 ${
                      isBest ? 'bg-emerald-200 text-emerald-900' : 'bg-(--tint-100) text-(--fg-muted)'
                    }`}>
                      #{a.attemptNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-(--fg) text-sm">
                          Intento {a.attemptNumber}
                        </span>
                        {isBest && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white rounded-full px-1.5 py-0.5">
                            MEJOR
                          </span>
                        )}
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider rounded-full px-1.5 py-0.5 ${
                          attemptPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {attemptPassed ? 'APROBADO' : 'SUSPENSO'}
                        </span>
                      </div>
                      <div className="text-xs text-(--fg-muted) mt-0.5">
                        {started} · {duration}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {score != null ? (
                        <span className="text-lg font-extrabold text-(--fg)">
                          {formatGrade(score)}
                          <span className="text-xs font-bold text-(--fg-subtle)"> / {formatGrade(task.gradeMax)}</span>
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-(--fg-muted)">—</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: '/courses/$courseId/quiz/$quizId/review/$attemptId',
                          params: { courseId, quizId: String(task.cmid), attemptId: String(a.id) },
                        })
                      }
                      className="text-sm font-extrabold text-emerald-700 hover:text-emerald-900 whitespace-nowrap transition shrink-0 ml-1"
                    >
                      Revisar →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#274E38] text-white text-base font-extrabold hover:brightness-110 shadow-sm transition"
          >
            <Play className="size-5" />
            Reintentar cuestionario
          </button>

          <Countdown dueDate={task.dueDate} openDate={task.openDate} />
          <InfoChip
            icon="🎯"
            label="Para aprobar"
            value={`${formatGrade(passGrade)} / ${formatGrade(task.gradeMax)}`}
          />
          {displayGrade != null && (
            <InfoChip
              icon="⭐"
              label="Tu mejor"
              value={`${formatGrade(displayGrade)} / ${formatGrade(task.gradeMax)}`}
              tone="success"
            />
          )}
          {task.dueDate && (
            <InfoChip icon="🔴" label="Cierra" value={formatDate(task.dueDate)} />
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Quiz preview — no previous attempts (start screen) ──────────────────────

function QuizPreviewEmpty({
  courseId,
  task,
  onStart,
}: {
  courseId: string;
  task: NonNullable<ReturnType<typeof useTask>['task']>;
  onStart: () => void;
}) {
  const navigate = useNavigate();
  const passGrade = task.gradePass ?? task.gradeMax * 0.5;

  return (
    <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
      <div className="flex items-center gap-4 mb-5">
        <button
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          className="grid size-10 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-(--tint-50) transition"
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="size-14 rounded-2xl bg-orange-100 grid place-items-center text-2xl shrink-0">✏️</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Cuestionario</span>
          <h1 className="text-2xl font-extrabold text-(--fg) leading-tight truncate">{task.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-3xl border border-(--border) p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="size-12 rounded-2xl bg-orange-100 text-orange-700 grid place-items-center text-2xl shrink-0">✏️</div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-(--fg) mb-1">¿Listo para empezar?</h2>
                <p className="text-sm text-(--fg-muted)">
                  Cuestionario de opción múltiple. Tienes todos los intentos que quieras.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-3 text-center">
                <div className="text-2xl">🎯</div>
                <div className="text-lg font-extrabold text-(--fg) leading-none mt-1">
                  {formatGrade(passGrade)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-(--fg-subtle) mt-0.5">
                  Para aprobar
                </div>
              </div>
              <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-3 text-center">
                <div className="text-2xl">🏆</div>
                <div className="text-lg font-extrabold text-(--fg) leading-none mt-1">
                  {formatGrade(task.gradeMax)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-(--fg-subtle) mt-0.5">
                  Nota máx.
                </div>
              </div>
              <div className="rounded-2xl bg-(--tint-50) border border-(--border) p-3 text-center">
                <div className="text-2xl">🔄</div>
                <div className="text-lg font-extrabold text-(--fg) leading-none mt-1">∞</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-(--fg-subtle) mt-0.5">
                  Intentos
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#274E38] text-white text-base font-extrabold hover:brightness-110 shadow-sm transition"
            >
              <Play className="size-5" />
              Empezar cuestionario
            </button>
            <p className="text-xs text-(--fg-subtle) text-center mt-3">
              Tu mejor calificación cuenta para la nota final.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Countdown dueDate={task.dueDate} openDate={task.openDate} />
          {task.openDate && <InfoChip icon="🟢" label="Abrió" value={formatDate(task.openDate)} />}
          {task.dueDate && <InfoChip icon="🔴" label="Cierra" value={formatDate(task.dueDate)} />}
          <InfoChip
            icon="🎯"
            label="Para aprobar"
            value={`${formatGrade(passGrade)} / ${formatGrade(task.gradeMax)}`}
          />
          <div className="bg-white rounded-2xl border border-(--border) p-4">
            <h4 className="text-sm font-extrabold text-(--fg) mb-2">¿Cómo funciona?</h4>
            <ul className="text-xs text-(--fg-muted) space-y-1.5 leading-relaxed">
              <li>• Una pregunta por pantalla.</li>
              <li>• Puedes volver atrás antes de enviar.</li>
              <li>• Ves el resultado al terminar.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Assign task fallback ─────────────────────────────────────────────────────

function AssignPage({
  courseId,
  task,
}: {
  courseId: string;
  task: NonNullable<ReturnType<typeof useTask>['task']>;
}) {
  const navigate = useNavigate();

  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-8">
      <div className="mb-6 flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          className="p-2"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Text className="text-2xl font-bold text-(--fg)">{task.title}</Text>
      </div>

      <div className="flex max-w-2xl flex-col gap-6">
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--fg-muted)">
            <CalendarClock className="size-4" />
            <span>Requisitos de finalización</span>
          </div>
          <div className="flex flex-col gap-2 text-sm text-(--fg)">
            {task.openDate && (
              <div className="flex gap-2">
                <span className="font-medium text-(--fg-muted)">Abrió:</span>
                <span className="capitalize">{formatDate(task.openDate)}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex gap-2">
                <span className="font-medium text-(--fg-muted)">Cierra:</span>
                <span className="capitalize">{formatDate(task.dueDate)}</span>
              </div>
            )}
            {!task.openDate && !task.dueDate && (
              <span className="text-(--fg-muted)">Sin fechas límite establecidas.</span>
            )}
          </div>
        </Card>

        <Button
          type="button"
          variant="primary"
          onClick={() => window.open(task.viewUrl, '_blank')}
        >
          Entregar tarea
        </Button>

        <Card className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--fg-muted)">
            <Trophy className="size-4" />
            <span>Calificación</span>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-(--fg)">
            {task.gradePass != null ? (
              <div className="flex gap-2">
                <span className="font-medium text-(--fg-muted)">Calificación para aprobar:</span>
                <span>
                  {formatGrade(task.gradePass)} de {formatGrade(task.gradeMax)}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <span className="font-medium text-(--fg-muted)">Calificación máxima:</span>
                <span>{formatGrade(task.gradeMax)}</span>
              </div>
            )}
            {task.status.graded && task.status.grade != null && (
              <div className="flex gap-2">
                <span className="font-medium text-(--fg-muted)">Tu calificación:</span>
                <span className="font-semibold text-emerald-700">{formatGrade(task.status.grade)}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TaskPage() {
  const navigate = useNavigate();
  const { courseId, modName, cmid } = useParams({ strict: false }) as {
    courseId: string;
    modName: string;
    cmid: string;
  };

  const { task, loading, error } = useTask(courseId, modName, cmid);
  const isQuiz = modName === 'quiz';

  const { attempts } = useQuizPreview(isQuiz && task ? task.id : null);

  const handleStart = () => {
    if (!task) return;
    void navigate({
      to: '/courses/$courseId/quiz/$quizId/attempt',
      params: { courseId, quizId: String(task.id) },
    });
  };

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="text-sm text-(--fg-muted)">Cargando...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col p-8">
        <Banner variant="error">{error}</Banner>
      </main>
    );
  }

  if (!task) return null;

  if (isQuiz) {
    if (attempts.length > 0) {
      return (
        <QuizPreviewWithAttempts
          courseId={courseId}
          task={task}
          attempts={attempts}
          onStart={handleStart}
        />
      );
    }
    return (
      <QuizPreviewEmpty
        courseId={courseId}
        task={task}
        onStart={handleStart}
      />
    );
  }

  return <AssignPage courseId={courseId} task={task} />;
}
