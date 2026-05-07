import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizReviewPage from '@/features/quiz/pages/QuizReviewPage';

export const quizReviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId/review/$attemptId',
  component: QuizReviewPage,
});
