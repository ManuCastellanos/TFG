import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useQuizAttempt } from '../hooks/useQuizAttempt';

export function QuizAttemptPageHeader() {
  const { courseId, quizId } = useParams({ strict: false }) as { courseId: string; quizId: string };
  const navigate = useNavigate();
  const { attempt } = useQuizAttempt(Number(quizId));
  const isFinished = attempt?.state === 'finished';

  return (
    <PageHeader
      emoji="🧩"
      emojiClass="bg-orange-100"
      subtitle="Cuestionario"
      title={isFinished ? 'Enviado' : 'Resolviendo'}
      onBack={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
      backLabel="Volver al curso"
    />
  );
}
