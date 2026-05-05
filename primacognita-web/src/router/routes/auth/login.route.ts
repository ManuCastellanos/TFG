import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';
import Login from '@/features/login/Login';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});
