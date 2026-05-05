import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '@/router/rootRoute';

import Login from '@/features/login/Login';
import Signup from '@/features/signup/Signup';
import ForgotPassword from '@/features/forgot-password/ForgotPassword';

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot_password',
  component: ForgotPassword,
});

export const authRoutes = [
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
];