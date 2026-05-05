import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';
import ForgotPassword from '@/features/forgot-password/ForgotPassword';


export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot_password',
  component: ForgotPassword,
});
