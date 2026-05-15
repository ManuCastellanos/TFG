import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import ForumPage from '@/features/forum/pages/ForumPage';

export const forumRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/forum/$cmid',
  component: ForumPage,
});
