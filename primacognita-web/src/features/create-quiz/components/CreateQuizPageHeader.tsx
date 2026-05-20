import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';

export function CreateQuizPageHeader() {
  const { courseId } = useParams({ strict: false }) as { courseId: string };
  const navigate = useNavigate();

  return (
    <PageHeader
      title="Nuevo cuestionario"
      onBack={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
      backLabel="Volver al curso"
    />
  );
}
