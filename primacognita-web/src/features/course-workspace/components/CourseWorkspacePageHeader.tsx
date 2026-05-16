import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useSession } from '@/shared/hooks/useSession';
import { useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import { COLOR_META } from '@/shared/theme/courseColors';
import { useCoursePageData } from '../hooks/useCoursePage';

export function CourseWorkspacePageHeader() {
  const { id: courseId } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { userId, token } = useSession();
  const { emoji, color } = useCourseCustomization(courseId);
  const { course } = useCoursePageData(courseId, userId, token);

  return (
    <PageHeader
      emoji={emoji}
      emojiClass={COLOR_META[color].soft}
      title={course?.fullname ?? 'Curso'}
      onBack={() => navigate({ to: '/courses' })}
      backLabel="Volver a cursos"
    />
  );
}
