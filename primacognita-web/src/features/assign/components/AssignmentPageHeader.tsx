import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useSession } from '@/shared/hooks/useSession';
import { isTeacherRole } from '@/modules/user/domain/User';
import { useAssignment } from '../hooks/useAssignment';

export function AssignmentPageHeader() {
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };
  const navigate = useNavigate();
  const { roleName } = useSession();
  const isTeacher = isTeacherRole(roleName);
  const { assignment, loading } = useAssignment(courseId, cmid);

  return (
    <PageHeader
      emoji="📝"
      emojiClass="bg-violet-100"
      subtitle={isTeacher ? 'Tarea · Calificar' : 'Tarea'}
      title={assignment?.title ?? (loading ? '…' : 'Tarea')}
      onBack={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
      backLabel="Volver al curso"
    />
  );
}
