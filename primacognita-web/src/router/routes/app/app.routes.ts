import { layoutRoute } from './layout.route';
import { dashboardRoute } from './dashboard.route';
import { coursesRoute } from './courses.route';
import { createCourseRoute } from './create-course.route';
import { courseRoute } from './course.route';
import { taskRoute } from './task.route';
import { quizAttemptRoute } from './quiz-attempt.route';

export const appRoutes = layoutRoute.addChildren([
  dashboardRoute,
  coursesRoute,
  createCourseRoute,
  courseRoute,
  taskRoute,
  quizAttemptRoute,
]);