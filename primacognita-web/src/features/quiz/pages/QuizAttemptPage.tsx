import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { RichText } from '@/components/ui/rich-text/RichText';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { QuizContentSkeleton } from '../components/QuizContentSkeleton';
import { useQuizAttempt } from '../hooks/useQuizAttempt';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { parseQuizQuestion } from '../utils/parseQuizQuestion';

export default function QuizAttemptPage() {
  const navigate = useNavigate();
  const { courseId, quizId } = useParams({ strict: false }) as {
    courseId: string;
    quizId: string;
  };

  const { attempt, questions, answers, loading, saving, error, setAnswer, clearAnswer, submit } = useQuizAttempt(
    Number(quizId),
  );
  const { set: setPageHeader } = usePageHeader();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  const parsed = questions.map((q) => ({ raw: q, parsed: parseQuizQuestion(q.html) }));
  const total = parsed.length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentIdx((i) => Math.min(total - 1, i + 1));
      if (e.key === 'ArrowLeft') setCurrentIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [total]);
  const current = parsed[currentIdx];
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;
  const isFinished = attempt?.state === 'finished';

  const titleLabel = isFinished ? 'Enviado' : 'Resolviendo';
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
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">{titleLabel}</h1>
        </div>
        {saving && <span className="ml-2 text-xs font-bold text-(--fg-muted)">Guardando…</span>}
      </div>,
    );
    return () => setPageHeader(null);
  }, [courseId, isFinished, saving]);

  const isAnswered = (idx: number) => {
    const q = parsed[idx];
    if (!q) return false;
    return q.parsed.inputNames.some((n) => answers[n] !== undefined);
  };

  const answeredCount = parsed.filter((_, i) => isAnswered(i)).length;

  // ── Finished screen ───────────────────────────────────────────────────────

  if (isFinished) {
    return (
      <Page>
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-(--border) p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-(--fg) mb-2">¡Cuestionario enviado!</h2>
          <p className="text-sm text-(--fg-muted) mb-6">Tus respuestas han sido registradas correctamente.</p>
          <Button
            variant="primary"
            type="button"
            onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
            className="w-full py-3"
          >
            Volver al curso
          </Button>
        </div>
      </Page>
    );
  }

  // ── Loading screen ────────────────────────────────────────────────────────

  if (loading && questions.length === 0) {
    return <QuizContentSkeleton />;
  }

  // ── Resolution screen ─────────────────────────────────────────────────────

  return (
    <Page>
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-(--border) p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-(--fg)">
              Pregunta <span className="text-orange-700">{currentIdx + 1}</span> de {total}
            </span>
            <span className="text-xs font-bold text-(--fg-muted)">
              {answeredCount} respondidas · {total - answeredCount} restantes
            </span>
          </div>
          <div className="h-2.5 bg-(--tint-100) rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-300 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {current && (
        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Left: question */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-(--border) p-7">
              {/* Question header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center font-extrabold text-sm shrink-0">
                    {currentIdx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">
                      Pregunta {currentIdx + 1}
                    </div>
                    <div className="text-xs font-bold text-(--fg-muted)">
                      {current.parsed.type === 'multianswer' ? 'Varias respuestas' : 'Opción múltiple'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="tinted"
                  size="sm"
                  type="button"
                  onClick={() => setFlagged((f) => ({ ...f, [currentIdx]: !f[currentIdx] }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                    flagged[currentIdx]
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-(--tint-50) text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
                  }`}
                >
                  <Flag className="size-3.5" />
                  {flagged[currentIdx] ? 'Marcada' : 'Marcar'}
                </Button>
              </div>

              {/* Question text */}
              {current.parsed.text ? (
                <RichText html={current.parsed.text} className="text-xl font-extrabold text-(--fg) leading-snug mb-6" />
              ) : null}

              {/* Options */}
              {current.parsed.options.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {current.parsed.options.map((opt, i) => {
                    const selected = answers[opt.name] === opt.value;
                    return (
                      <button
                        key={`${opt.name}-${opt.value}`}
                        type="button"
                        onClick={() => (selected ? clearAnswer(opt.name) : setAnswer(opt.name, opt.value))}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition ${
                          selected
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-(--border) bg-white hover:border-(--border-strong) hover:bg-(--tint-50)'
                        }`}
                      >
                        <div
                          className={`size-10 rounded-xl grid place-items-center font-extrabold text-base shrink-0 ${
                            selected ? 'bg-orange-500 text-white' : 'bg-(--tint-100) text-(--fg-muted)'
                          }`}
                        >
                          {String.fromCharCode(97 + i)}
                        </div>
                        <RichText
                          html={opt.label}
                          className="text-sm font-bold text-(--fg) flex-1 leading-snug"
                          as="span"
                        />
                        {selected && (
                          <svg
                            className="size-5 text-orange-600 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            aria-hidden
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-(--border) bg-(--tint-50) p-4 text-sm text-(--fg-muted)">
                  No se pudieron cargar las opciones de esta pregunta.
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={isFirst}
                className="flex items-center gap-2 px-5 py-3"
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <span className="text-xs font-bold text-(--fg-muted) text-center">
                Tu progreso se guarda automáticamente
              </span>
              {!isLast ? (
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                  className="flex items-center gap-2 px-5 py-3"
                >
                  Siguiente
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button
                  variant="successSolid"
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3"
                >
                  <Send className="size-4" />
                  Terminar y enviar
                </Button>
              )}
            </div>
          </div>

          {/* Right: question palette */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-(--border) p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">Navegación</div>
              <h3 className="font-semibold text-(--fg) mb-4">Preguntas</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {parsed.map((item) => {
                  const idx = parsed.indexOf(item);
                  const isActive = idx === currentIdx;
                  const answered = isAnswered(idx);
                  const isFlagged = flagged[idx];
                  return (
                    <button
                      key={item.raw.slot}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`relative size-10 rounded-xl font-extrabold text-sm transition border-2 ${
                        isActive
                          ? 'bg-[#274E38] text-white border-[#274E38]'
                          : answered
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:border-emerald-400'
                            : 'bg-(--tint-50) text-(--fg-muted) border-(--border) hover:border-(--border-strong)'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-amber-400 border-2 border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-(--fg-muted) mb-5">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md bg-[#274E38]" />
                  Pregunta actual
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md bg-emerald-200" />
                  Respondida
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md border border-(--border) bg-(--tint-50)" />
                  Sin responder
                </div>
              </div>
              <Button
                variant="ghost"
                type="button"
                onClick={submit}
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-orange-100 text-orange-800 hover:bg-orange-200 disabled:opacity-50"
              >
                Terminar intento
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
