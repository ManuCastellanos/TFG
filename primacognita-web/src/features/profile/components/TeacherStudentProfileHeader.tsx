import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useSession } from '@/shared/hooks/useSession';
import { useParticipants } from '@/features/course-workspace/sections/student/participants/hooks/useParticipants';

export function TeacherStudentProfileHeader() {
  const { userId: studentId } = useParams({ strict: false }) as { userId: string };
  const { courseId } = useSearch({ strict: false }) as { courseId?: string };
  const { token } = useSession();
  const navigate = useNavigate();
  const { participants } = useParticipants(token, courseId ?? null);
  const student = participants.find((p) => p.id === studentId);

  return (
    <PageHeader
      emoji="👤"
      emojiClass="bg-sky-100"
      subtitle="Perfil del alumno"
      title={student?.fullName ?? 'Alumno'}
      onBack={() => (courseId ? navigate({ to: '/courses/$id', params: { id: courseId } }) : navigate({ to: '/dashboard' }))}
      backLabel="Volver al curso"
    />
  );
}
