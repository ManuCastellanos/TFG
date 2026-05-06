import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Banner } from '@/components/feedback/banner/Banner';
import { Card } from '@/components/ui/card/Card';
import { Text } from '@/components/ui/text/Text';
import { useQuizAttempt } from '../hooks/useQuizAttempt';
import QuizQuestion from '../components/QuizQuestion';
import QuizNavigation from '../components/QuizNavigation';

const formatGrade = (value: number) =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function QuizAttemptPage() {
  const navigate = useNavigate();
  const { courseId, quizId } = useParams({ strict: false }) as { courseId: string; quizId: string };

  const { attempt, questions, nextPage, loading, saving, error, setAnswer, navigateTo, submit } = useQuizAttempt(
    Number(quizId),
  );

  const currentPage = attempt?.currentPage ?? 0;
  const isFinished = attempt?.state === 'finished';

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
        <Text className="text-2xl font-bold text-(--fg)">Cuestionario</Text>
        {saving && <span className="text-sm text-(--fg-muted)">Guardando...</span>}
      </div>

      {error && <Banner variant="error">{error}</Banner>}

      {isFinished && attempt && (
        <Card className="flex max-w-lg flex-col gap-4 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--fg-muted)">
            <Trophy className="size-4" />
            <span>Cuestionario completado</span>
          </div>
          {attempt.sumGrades != null && (
            <div className="flex gap-2 text-sm text-(--fg)">
              <span className="font-medium text-(--fg-muted)">Puntuación:</span>
              <span className="font-semibold text-(--color-pr)">{formatGrade(attempt.sumGrades)}</span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
          >
            Volver al curso
          </Button>
        </Card>
      )}

      {!isFinished && !loading && questions.length > 0 && (
        <div className="flex max-w-3xl flex-col gap-6">
          {questions.map((q) => (
            <QuizQuestion key={q.slot} question={q} onAnswerChange={setAnswer} />
          ))}
          <QuizNavigation
            currentPage={currentPage}
            nextPage={nextPage}
            loading={loading}
            onPrev={() => navigateTo(currentPage - 1)}
            onNext={() => navigateTo(nextPage)}
            onSubmit={submit}
          />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="text-(--fg-muted)">Cargando...</span>
        </div>
      )}
    </main>
  );
}
