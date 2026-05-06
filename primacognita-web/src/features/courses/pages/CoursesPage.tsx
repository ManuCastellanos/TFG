import { useNavigate } from '@tanstack/react-router';
import { Banner } from '@/components/feedback/banner/Banner';
import { Text } from '@/components/ui/text/Text';
import { CoursesList } from '../components/CoursesList';
import { CoursesHeader } from '../components/CoursesHeader';
import { useCourses } from '../hooks/useCourses';

export default function CoursesPage() {
  const navigate = useNavigate();
  const { courses, loading, error, isTeacher } = useCourses();

  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-8">
      <CoursesHeader
        isTeacher={isTeacher}
        onCreate={() => navigate({ to: '/courses/new' })}
        onManage={() => navigate({ to: '/courses/manage' })}
      />

      {error && <Banner variant="error">{error}</Banner>}

      {loading ? (
        <Text className="text-(--muted)">Cargando cursos...</Text>
      ) : (
        <CoursesList
          courses={courses}
          onCourseClick={(id) => navigate({ to: '/courses/$id', params: { id } })}
          showHeader={false}
        />
      )}
    </main>
  );
}
