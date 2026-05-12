import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { ResultBanner } from '@/features/quiz/components/ResultBanner';
import { useQuizMeta } from '../hooks/useQuizMeta';
import { useQuizPreview } from '../hooks/useQuizPreview';
import { usePageHeader } from '@/layouts/pageHeader.context';
import type { UserAttempt } from '@/modules/quiz/domain/IQuizRepository';
import type { QuizMeta } from '@/modules/quiz/domain/IQuizRepository';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Quiz preview — with previous attempts ────────────────────────────────────

function QuizPreviewWithAttempts({
  courseId,
  meta,
  attempts,
  bestGrade,
  attemptGrades,
  onStart,
}: {
  courseId: string;
  meta: QuizMeta;
  attempts: UserAttempt[];
  bestGrade: string | null;
  attemptGrades: Record<number, string>;
  onStart: () => void;
}) {
  const navigate = useNavigate();

  const passGrade = meta.gradePass ?? meta.gradeMax * 0.5;
  const normalizedGrade = bestGrade != null ? parseFloat(bestGrade) : null;
  const passed = normalizedGrade != null && normalizedGrade >= passGrade;

  const bestAttemptId: number | null =
    Object.keys(attemptGrades).length > 0
      ? Number(
          Object.entries(attemptGrades).reduce((best, curr) =>
            parseFloat(curr[1]) >= parseFloat(best[1]) ? curr : best,
          )[0],
        )
      : null;

  return (
    <Page>
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          {normalizedGrade != null ? (
            <ResultBanner
              grade={normalizedGrade}
              maxGrade={meta.gradeMax}
              passGrade={passGrade}
              title={meta.title}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-(--border) p-6 flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-emerald-100 grid place-items-center text-2xl shrink-0">✅</div>
              <div>
                <div className="font-extrabold text-(--fg)">Cuestionario completado</div>
                <p className="text-sm text-(--fg-muted) mt-0.5">La nota estará disponible en breve.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-(--border) p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-(--fg)">Tus intentos</h3>
              <span className="text-xs font-bold text-(--fg-subtle)">
                {attempts.length} {attempts.length === 1 ? 'intento' : 'intentos'} · te quedan ilimitados
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[...attempts].reverse().map((a) => {
                const normalizedScore = attemptGrades[a.id] != null ? parseFloat(attemptGrades[a.id]) : null;
                const attemptPassed = normalizedScore != null && normalizedScore >= passGrade;
                const isBest = bestAttemptId === a.id;
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
                      {attemptGrades[a.id] != null ? (
                        <span className="text-lg font-extrabold text-(--fg)">
                          {parseFloat(attemptGrades[a.id]).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-xs font-bold text-(--fg-subtle)"> / {formatGrade(meta.gradeMax)}</span>
                        </span>
                      ) : a.sumGrades != null ? (
                        <span className="text-sm font-bold text-(--fg-muted)">{formatGrade(a.sumGrades)}</span>
                      ) : (
                        <span className="text-sm font-bold text-(--fg-muted)">—</span>
                      )}
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      type="button"
                      onClick={() =>
                        navigate({
                          to: '/courses/$courseId/quiz/$quizId/review/$attemptId',
                          params: { courseId, quizId: String(meta.cmid), attemptId: String(a.id) },
                        })
                      }
                      className="whitespace-nowrap shrink-0 ml-1"
                    >
                      Revisar →
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            type="button"
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-5 py-4 text-base shadow-sm"
          >
            <Play className="size-5" />
            Reintentar cuestionario
          </Button>

          <Countdown dueDate={meta.dueDate} openDate={meta.openDate} />
          <InfoChip
            icon="🎯"
            label="Para aprobar"
            value={`${formatGrade(passGrade)} / ${formatGrade(meta.gradeMax)}`}
          />
          {normalizedGrade != null && (
            <InfoChip
              icon="⭐"
              label="Tu mejor"
              value={`${parseFloat(normalizedGrade.toFixed(2)).toLocaleString('es-ES', { minimumFractionDigits: 2 })} / ${formatGrade(meta.gradeMax)}`}
              tone={passed ? 'success' : 'warning'}
            />
          )}
          {meta.dueDate && (
            <InfoChip icon="🔴" label="Cierra" value={formatDate(meta.dueDate)} />
          )}
        </div>
      </div>
    </Page>
  );
}

// ─── Quiz preview — no previous attempts ─────────────────────────────────────

function QuizPreviewEmpty({
  meta,
  onStart,
}: {
  meta: QuizMeta;
  onStart: () => void;
}) {
  const passGrade = meta.gradePass ?? meta.gradeMax * 0.5;

  return (
    <Page>
      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-3xl border border-(--border) p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="size-12 rounded-2xl bg-orange-100 text-orange-700 grid place-items-center text-2xl shrink-0">🧩</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-(--fg) mb-1">¿Listo para empezar?</h2>
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
                  {formatGrade(meta.gradeMax)}
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
            <Button
              variant="primary"
              type="button"
              onClick={onStart}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base shadow-sm"
            >
              <Play className="size-5" />
              Empezar cuestionario
            </Button>
            <p className="text-xs text-(--fg-subtle) text-center mt-3">
              Tu mejor calificación cuenta para la nota final.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Countdown dueDate={meta.dueDate} openDate={meta.openDate} />
          {meta.openDate && <InfoChip icon="🟢" label="Abrió" value={formatDate(meta.openDate)} />}
          {meta.dueDate && <InfoChip icon="🔴" label="Cierra" value={formatDate(meta.dueDate)} />}
          <InfoChip
            icon="🎯"
            label="Para aprobar"
            value={`${formatGrade(passGrade)} / ${formatGrade(meta.gradeMax)}`}
          />
          <div className="bg-white rounded-2xl border border-(--border) p-4">
            <h4 className="text-sm font-semibold text-(--fg) mb-2">¿Cómo funciona?</h4>
            <ul className="text-xs text-(--fg-muted) space-y-1.5 leading-relaxed">
              <li>• Una pregunta por pantalla.</li>
              <li>• Puedes volver atrás antes de enviar.</li>
              <li>• Ves el resultado al terminar.</li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function QuizPreviewPage() {
  const navigate = useNavigate();
  const { courseId, quizId: cmid } = useParams({ strict: false }) as { courseId: string; quizId: string };
  const { meta, loading, error } = useQuizMeta(courseId, cmid);
  const { attempts, bestGrade, attemptGrades } = useQuizPreview(meta ? meta.id : null);
  const { set: setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          aria-label="Volver al curso"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="size-14 shrink-0 rounded-2xl bg-orange-100 grid place-items-center text-2xl">🧩</div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Cuestionario</span>
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">
            {meta?.title ?? (loading ? '…' : 'Cuestionario')}
          </h1>
        </div>
      </div>,
    );
    return () => setPageHeader(null);
  }, [meta?.title, courseId, loading]);

  const handleStart = () => {
    if (!meta) return;
    void navigate({
      to: '/courses/$courseId/quiz/$quizId/attempt',
      params: { courseId, quizId: String(meta.id) },
    });
  };

  if (loading) {
    return (
      <Page>
        <span className="text-sm text-(--fg-muted)">Cargando…</span>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert variant="error">{error}</Alert>
      </Page>
    );
  }

  if (!meta) return null;

  if (attempts.length > 0) {
    return (
      <QuizPreviewWithAttempts
        courseId={courseId}
        meta={meta}
        attempts={attempts}
        bestGrade={bestGrade}
        attemptGrades={attemptGrades}
        onStart={handleStart}
      />
    );
  }

  return (
    <QuizPreviewEmpty
      meta={meta}
      onStart={handleStart}
    />
  );
}
