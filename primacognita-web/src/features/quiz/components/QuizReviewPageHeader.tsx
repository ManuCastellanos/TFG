import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useQuizReview } from '../hooks/useQuizReview';

export function QuizReviewPageHeader() {
  const { courseId, quizId, attemptId } = useParams({ strict: false }) as {
    courseId: string;
    quizId: string;
    attemptId: string;
  };
  const navigate = useNavigate();
  const { review } = useQuizReview(Number(attemptId));

  return (
    <PageHeader
      emoji="🧩"
      emojiClass="bg-orange-100"
      subtitle="Cuestionario"
      title="Revisión del intento"
      onBack={() => navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId } })}
      backLabel="Volver al cuestionario"
      end={
        review && (
          <span className="rounded-xl bg-(--tint-100) border border-(--border) px-2.5 py-1 text-base font-extrabold text-(--fg) leading-none shrink-0">
            {review.grade}
          </span>
        )
      }
    />
  );
}
