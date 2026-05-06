import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';
import LoginPage from '@/features/login/pages/LoginPage';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});
