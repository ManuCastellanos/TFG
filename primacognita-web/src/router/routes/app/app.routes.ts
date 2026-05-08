import { layoutRoute } from './layout.route';
import { dashboardRoute } from './dashboard.route';
import { coursesRoute } from './courses.route';
import { createCourseRoute } from './create-course.route';
import { courseRoute } from './course.route';
import { assignmentRoute } from './assignment.route';
import { quizAttemptRoute } from './quiz-attempt.route';
import { quizPreviewRoute } from './quiz-preview.route';
import { quizReviewRoute } from './quiz-review.route';

export const appRoutes = layoutRoute.addChildren([
  dashboardRoute,
  coursesRoute,
  createCourseRoute,
  courseRoute,
  assignmentRoute,
  quizPreviewRoute,
  quizAttemptRoute,
  quizReviewRoute,
]);
