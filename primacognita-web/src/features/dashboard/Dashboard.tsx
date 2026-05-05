import { useNavigate } from '@tanstack/react-router';
import { CoursesList } from '../courses/CoursesList';
import { useDashboard } from './hooks/useDashboard';
import { Card } from '@/components/card/Card';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { courses } = useDashboard();

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
