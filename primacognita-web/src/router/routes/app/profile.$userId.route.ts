import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import TeacherStudentProfilePage from '@/features/profile/page/TeacherStudentProfilePage';
import { TeacherStudentProfileHeader } from '@/features/profile/components/TeacherStudentProfileHeader';

export const teacherStudentProfileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile/$userId',
  validateSearch: (search: Record<string, unknown>): { courseId?: string } => ({
    courseId: typeof search.courseId === 'string' ? search.courseId : undefined,
  }),
  component: TeacherStudentProfilePage,
  staticData: { header: TeacherStudentProfileHeader },
});
