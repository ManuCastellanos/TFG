import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';
import { AppLayoutRoute } from './app.layout';

export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayoutRoute,
});