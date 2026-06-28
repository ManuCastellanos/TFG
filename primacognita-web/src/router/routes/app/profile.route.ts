import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import ProfilePage from '@/features/profile/page/ProfilePage';

export const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile',
  component: ProfilePage,
});
