import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';
import Signup from '@/features/signup/Signup';

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
});
