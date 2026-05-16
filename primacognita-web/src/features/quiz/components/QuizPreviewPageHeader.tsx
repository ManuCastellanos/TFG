import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useQuizMeta } from '../hooks/useQuizMeta';

export function QuizPreviewPageHeader() {
  const { courseId, quizId: cmid } = useParams({ strict: false }) as { courseId: string; quizId: string };
  const navigate = useNavigate();
  const { meta, loading } = useQuizMeta(courseId, cmid);

  return (
    <PageHeader
      emoji="🧩"
      emojiClass="bg-orange-100"
      subtitle="Cuestionario"
      title={meta?.title ?? (loading ? '…' : 'Cuestionario')}
      onBack={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
      backLabel="Volver al curso"
    />
  );
}
