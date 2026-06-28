import { layoutRoute } from './layout.route';
import { dashboardRoute } from './dashboard.route';
import { coursesRoute } from './courses.route';
import { createCourseRoute } from './create-course.route';
import { courseRoute } from './course.route';
import { assignmentRoute } from './assignment.route';
import { createAssignmentRoute } from './create-assignment.route';
import { quizAttemptRoute } from './quiz-attempt.route';
import { quizPreviewRoute } from './quiz-preview.route';
import { quizReviewRoute } from './quiz-review.route';
import { createQuizRoute } from './create-quiz.route';
import { quizEditQuestionsRoute } from './quiz-edit-questions.route';
import { forumRoute } from './forum.route';
import { profileRoute } from './profile.route';

export const appRoutes = layoutRoute.addChildren([
  dashboardRoute,
  profileRoute,
  coursesRoute,
  createCourseRoute,
  courseRoute,
  assignmentRoute,
  createAssignmentRoute,
  quizPreviewRoute,
  quizAttemptRoute,
  quizReviewRoute,
  createQuizRoute,
  quizEditQuestionsRoute,
  forumRoute,
]);
