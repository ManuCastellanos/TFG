import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import Dashboard from '@/features/dashboard/Dashboard';

export const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: Dashboard,
});