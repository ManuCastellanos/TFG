import { createRouter, RouterProvider, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Login from './features/login/Login';
import Dashboard from './features/dashboard/Dashboard';
import Signup from './features/signup/Signup';
import ForgotPassword from './features/forgot-password/ForgotPassword';
import Courses from './features/courses/Courses';
import CreateCourse from './features/courses/CreateCourse';
import CoursePage from './features/courses/CoursePage';
import TaskPage from './features/task/TaskPage';
import { AppLayout } from './layouts/AppLayout';
import { RightPanel } from './layouts/components/rightpanel/RightPanel';


function AppLayoutRoute() {
  return (
    <AppLayout rightPanel={<RightPanel />}>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot_password',
  component: ForgotPassword,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayoutRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const coursesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/courses',
  component: Courses,
});

const createCourseRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/courses/new',
  component: CreateCourse,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/courses/$id',
  component: CoursePage,
});

const assignmentRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/courses/$courseId/exercise/$modName/$cmid',
  component: TaskPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  appLayoutRoute.addChildren([dashboardRoute, coursesRoute, createCourseRoute, courseDetailRoute, assignmentRoute]),
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
