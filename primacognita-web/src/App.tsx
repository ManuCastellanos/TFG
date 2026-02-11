import {createRouter, RouterProvider, Route, RootRoute} from "@tanstack/react-router";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";

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

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
