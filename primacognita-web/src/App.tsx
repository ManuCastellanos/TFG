import {
  createRouter,
  RouterProvider,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import Login from "./features/login/Login";
import Dashboard from "./features/dashboard/Dashboard";
import Signup from "./features/signup/Signup";
import ForgotPassword from "./features/forgot-password/ForgotPassword";
import Courses from "./features/courses/Courses";
import CreateCourse from "./features/courses/CreateCourse";

const rootRoute = new RootRoute();

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Login,
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});

const forgotPasswordRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/forgot_password",
  component: ForgotPassword,
});

const coursesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/courses",
  component: Courses,
});

const createCourseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/courses/new",
  component: CreateCourse,
});

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute, signupRoute, forgotPasswordRoute, coursesRoute, createCourseRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
