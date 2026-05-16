import { useNavigate, useParams } from '@tanstack/react-router';
import { PageHeader } from '@/components/ui/pageHeader/PageHeader';
import { useForumByCourse } from '@/features/course-workspace/sections/student/announcements/hooks/useAnnouncements';

export function ForumPageHeader() {
  const { courseId, cmid } = useParams({ strict: false }) as { courseId: string; cmid: string };
  const navigate = useNavigate();
  const { data: forums, isLoading } = useForumByCourse(courseId);
  const forum = forums?.find((f) => f.cmid === Number(cmid)) ?? null;

  return (
    <PageHeader
      emoji="💬"
      emojiClass="bg-emerald-100"
      subtitle="Foro"
      title={forum?.name ?? (isLoading ? '…' : 'Foro')}
      onBack={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
      backLabel="Volver al curso"
    />
  );
}
