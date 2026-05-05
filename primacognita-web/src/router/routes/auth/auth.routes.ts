import { loginRoute } from './login.route';
import { signupRoute } from './signup.route';
import { forgotPasswordRoute } from './forgotPassword.route';
import { rootRoute } from '@/router/rootRoute';

export const authRoutes = rootRoute.addChildren([loginRoute, signupRoute, forgotPasswordRoute]);
