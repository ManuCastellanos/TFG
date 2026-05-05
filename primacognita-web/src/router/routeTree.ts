import { rootRoute } from '@/router/rootRoute';
import { appRoutes } from './routes/app/app.routes';
import { authRoutes } from './routes/auth/auth.routes';

export const routeTree = rootRoute.addChildren([
  ...authRoutes,
  appRoutes,
]);