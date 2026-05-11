import { useNavigate } from '@tanstack/react-router';

import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useSession } from '@/shared/hooks/useSession';
import { useUserCourses } from '@/shared/hooks/useUserCourses';

import DashboardView from './DashboardView';

const DashboardPage = () => {
  const navigate = useNavigate();

  const { userId, token } = useSession();

  const { user } = useCurrentUser();

  const { courses } = useUserCourses(userId, token);

  const handleNavigateToCourses = () => {
    navigate({ to: '/courses' });
  };

  const handleCourseClick = (courseId: string) => {
    navigate({
      to: '/courses/$id',
      params: { id: courseId },
    });
  };

  return (
    <DashboardView
      user={user}
      courses={courses}
      onNavigateToCourses={handleNavigateToCourses}
      onCourseClick={handleCourseClick}
    />
  );
};

export default DashboardPage;