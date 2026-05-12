import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { RichText } from '@/components/ui/rich-text/RichText';
import { Alert } from '@/components/ui/alert/Alert';
import { Page } from '@/components/ui/page/Page';
import { useQuizReview } from '../hooks/useQuizReview';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { parseReviewQuestion } from '../utils/parseQuizQuestion';
import type { ReviewQuestion } from '@/modules/quiz/domain/IQuizRepository';
import type { ReviewOption } from '../utils/parseQuizQuestion';

type StateInfo = {
  label: string;
  chipClass: string;
  cardBorderClass: string;
  badgeClass: string;
  paletteFilled: string;
  paletteActive: string;
};

function getStateInfo(state: string): StateInfo {
  if (state === 'gradedright') return {
    label: 'Correcta',
    chipClass: 'bg-emerald-100 text-emerald-800',
    cardBorderClass: 'border-emerald-300',
    badgeClass: 'bg-emerald-500 text-white',
    paletteFilled: 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:brightness-95',
    paletteActive: 'bg-white border-2 border-emerald-500 text-emerald-700',
  };
  if (state === 'gradedpartial') return {
    label: 'Parcial',
    chipClass: 'bg-amber-100 text-amber-800',
    cardBorderClass: 'border-amber-300',
    badgeClass: 'bg-amber-400 text-white',
    paletteFilled: 'bg-amber-100 text-amber-800 border border-amber-200 hover:brightness-95',
    paletteActive: 'bg-white border-2 border-amber-500 text-amber-700',
  };
  if (state === 'gradedwrong') return {
    label: 'Incorrecta',
    chipClass: 'bg-rose-100 text-rose-800',
    cardBorderClass: 'border-rose-300',
    badgeClass: 'bg-rose-500 text-white',
    paletteFilled: 'bg-rose-100 text-rose-800 border border-rose-200 hover:brightness-95',
    paletteActive: 'bg-white border-2 border-rose-500 text-rose-700',
  };
  return {
    label: 'Sin responder',
    chipClass: 'bg-(--tint-100) text-(--fg-muted)',
    cardBorderClass: 'border-(--border)',
    badgeClass: 'bg-(--tint-100) text-(--fg-muted)',
    paletteFilled: 'bg-(--tint-50) text-(--fg-muted) border border-(--border) hover:bg-(--tint-100)',
    paletteActive: 'bg-white border-2 border-(--border-strong) text-(--fg)',
  };
}

function optionStyle(opt: ReviewOption, questionState: string): { container: string; badge: string } {
  // Use question state to determine checked-option color (reliable).
  // Use per-row HTML classes only for unselected correct options (when Moodle marks them).
  if (opt.checked && questionState === 'gradedright') return {
    container: 'border-2 border-emerald-500 bg-emerald-50',
    badge: 'bg-emerald-500 text-white',
  };
  if (opt.checked && questionState === 'gradedwrong') return {
    container: 'border-2 border-rose-500 bg-rose-50',
    badge: 'bg-rose-500 text-white',
  };
  if (opt.checked && questionState === 'gradedpartial') return {
    container: 'border-2 border-amber-400 bg-amber-50',
    badge: 'bg-amber-400 text-white',
  };
  // Moodle explicitly marked this row as the correct answer (not selected by student)
  if (!opt.checked && opt.isCorrect) return {
    container: 'border-2 border-emerald-500 bg-emerald-50',
    badge: 'bg-emerald-400 text-white',
  };
  return {
    container: 'border-2 border-(--border) bg-white',
    badge: 'bg-(--tint-100) text-(--fg-muted)',
  };
}

function ReviewQuestionCard({ question, idx }: { question: ReviewQuestion; idx: number }) {
  const parsed = parseReviewQuestion(question.html);
  const info = getStateInfo(question.state);

  return (
    <div className={`bg-white rounded-3xl border-2 p-7 ${info.cardBorderClass}`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-2xl grid place-items-center font-extrabold text-sm shrink-0 ${info.badgeClass}`}>
            {idx + 1}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">
              Pregunta {idx + 1}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${info.chipClass}`}>
            {info.label}
          </span>
          {question.mark != null ? (
            <span className="text-sm font-extrabold text-(--fg)">
              {question.mark.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-bold text-(--fg-muted)">
                {' '}/ {question.maxmark.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </span>
          ) : (
            <span className="text-sm font-bold text-(--fg-muted)">
              : / {question.maxmark.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      {parsed.text ? (
        <RichText html={parsed.text} className="text-xl font-extrabold text-(--fg) leading-snug mb-6" />
      ) : null}

      {parsed.options.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {parsed.options.map((opt, i) => {
            const style = optionStyle(opt, question.state);
            const showTick =
              (opt.checked && question.state === 'gradedright') ||
              (!opt.checked && opt.isCorrect);
            const showCross = opt.checked && question.state === 'gradedwrong';
            return (
              <div
                key={opt.id}
                className={`flex items-center gap-3 p-4 rounded-2xl ${style.container}`}
              >
                <div className={`size-10 rounded-xl grid place-items-center font-extrabold text-base shrink-0 ${style.badge}`}>
                  {String.fromCharCode(97 + i)}
                </div>
                <RichText html={opt.label} className="text-sm font-bold text-(--fg) flex-1 leading-snug" as="span" />
                {showTick && (
                  <svg className="size-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {showCross && (
                  <svg className="size-5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      ) : parsed.answerHtml ? (
        <RichText html={parsed.answerHtml} className="rounded-2xl border border-(--border) bg-(--tint-50) p-4 text-sm text-(--fg) [&_input]:accent-emerald-600" />
      ) : null}

      {/* Correct answer block — shown persistently for wrong/partial questions */}
      {(question.state === 'gradedwrong' || question.state === 'gradedpartial') &&
        (parsed.correctOptions.length > 0 || parsed.correctAnswerText) && (
        <div className="mt-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 mb-2">
            Respuesta correcta
          </div>
          {parsed.correctOptions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {parsed.correctOptions.map((opt) => (
                <div key={`correct-${opt.id}`} className="flex items-center gap-2.5">
                  <span className="size-6 rounded-lg bg-emerald-500 text-white grid place-items-center text-xs font-extrabold shrink-0">
                    ✓
                  </span>
                  <RichText html={opt.label} className="text-sm font-bold text-emerald-900 leading-snug" as="span" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-emerald-900">{parsed.correctAnswerText}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizReviewPage() {
  const navigate = useNavigate();
  const { courseId, quizId, attemptId } = useParams({ strict: false }) as {
    courseId: string;
    quizId: string;
    attemptId: string;
  };

  const { review, loading, error } = useQuizReview(Number(attemptId));
  const { set: setPageHeader } = usePageHeader();
  const [currentIdx, setCurrentIdx] = useState(0);

  const questions = review?.questions ?? [];
  const total = questions.length;
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;
  const current = questions[currentIdx];

  const correctCount = questions.filter((q) => q.state === 'gradedright').length;
  const partialCount = questions.filter((q) => q.state === 'gradedpartial').length;
  const wrongCount = questions.filter((q) => q.state === 'gradedwrong').length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentIdx((i) => Math.min(total - 1, i + 1));
      if (e.key === 'ArrowLeft') setCurrentIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [total]);

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId } })}
          aria-label="Volver al cuestionario"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="size-14 shrink-0 rounded-2xl bg-orange-100 grid place-items-center text-2xl">🧩</div>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle)">Cuestionario</span>
            <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">Revisión del intento</h1>
          </div>
          {review && (
            <span className="rounded-xl bg-(--tint-100) border border-(--border) px-2.5 py-1 text-base font-extrabold text-(--fg) leading-none shrink-0">
              {review.grade}
            </span>
          )}
        </div>
      </div>,
    );
    return () => setPageHeader(null);
  }, [courseId, quizId, review?.grade]);

  if (loading) {
    return (
      <Page>
        <span className="text-sm text-(--fg-muted)">Cargando revisión…</span>
      </Page>
    );
  }

  return (
    <Page>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {/* Progress bar */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-(--border) p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-(--fg)">
              Pregunta <span className="text-orange-700">{currentIdx + 1}</span> de {total}
            </span>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-emerald-700">{correctCount} correctas</span>
              {partialCount > 0 && <span className="text-amber-700">{partialCount} parciales</span>}
              <span className="text-rose-700">{wrongCount} incorrectas</span>
            </div>
          </div>
          <div className="h-2.5 bg-(--tint-100) rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(correctCount / total) * 100}%` }} />
            <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(partialCount / total) * 100}%` }} />
            <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(wrongCount / total) * 100}%` }} />
          </div>
        </div>
      )}

      {current && (
        <div className="grid grid-cols-[1fr_300px] gap-6">
          {/* Left: question */}
          <div className="flex flex-col gap-4">
            <ReviewQuestionCard question={current} idx={currentIdx} />

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
              <Button
                variant="primary"
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                disabled={isLast}
                className="flex items-center gap-2 px-5 py-3"
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Right: question palette */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-(--border) p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-(--fg-subtle) mb-1">Navegación</div>
              <h3 className="font-semibold text-(--fg) mb-4">Preguntas</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q) => {
                  const idx = questions.indexOf(q);
                  const isActive = idx === currentIdx;
                  const info = getStateInfo(q.state);
                  return (
                    <button
                      key={q.slot}
                      type="button"
                        onClick={() => setCurrentIdx(idx)}
                      className={`size-10 rounded-xl font-extrabold text-sm transition ${
                        isActive ? info.paletteActive : info.paletteFilled
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-(--fg-muted)">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md border-2 border-emerald-500 bg-white" />
                  Pregunta actual
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md bg-emerald-100 border border-emerald-200" />
                  Correcta
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md bg-amber-100 border border-amber-200" />
                  Parcial
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md bg-rose-100 border border-rose-200" />
                  Incorrecta
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-md border border-(--border) bg-(--tint-50)" />
                  Sin responder
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
