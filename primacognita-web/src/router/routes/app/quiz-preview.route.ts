import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import TaskPage from '@/features/task/TaskPage';

export const quizPreviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId',
  component: TaskPage,
});