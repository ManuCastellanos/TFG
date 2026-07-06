import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import SchedulePage from '@/features/schedule/pages/SchedulePage';

export const scheduleRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/schedule',
  component: SchedulePage,
});
