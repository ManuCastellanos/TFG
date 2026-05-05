import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import TaskPage from '@/features/task/TaskPage';

export const taskRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/exercise/$modName/$cmid',
  component: TaskPage,
});