import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import DashboardPage from '@/features/dashboard/page/DashboardPage';

export const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});