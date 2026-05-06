import { useNavigate } from '@tanstack/react-router';
import { CoursesList } from '../courses/CoursesList';
import { Card } from '@/components/card/Card';
import { useUserCourses } from '@/shared/hooks/useUserCourses';
import { useSession } from '@/shared/hooks/useSession';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { userId, token } = useSession();
  const { courses } = useUserCourses(userId, token);

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
      <Card className="bg-(--panel) h-full flex-1">
        <CoursesList
          courses={courses}
          onCourseClick={(id) => navigate({ to: '/courses/$id', params: { id } })}
          onViewAll={() => navigate({ to: '/courses' })}
        />
      </Card>
    </main>
  );
};

export default Dashboard;
