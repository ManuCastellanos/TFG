import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CreateAssignmentPage from '@/features/create-assignment/pages/CreateAssignmentPage';

export const createAssignmentRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/assignments/create/$sectionNum',
  component: CreateAssignmentPage,
});
