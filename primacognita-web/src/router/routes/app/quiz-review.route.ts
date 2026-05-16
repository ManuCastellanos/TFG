import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizReviewPage from '@/features/quiz/pages/QuizReviewPage';
import { QuizReviewPageHeader } from '@/features/quiz/components/QuizReviewPageHeader';

export const quizReviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId/review/$attemptId',
  component: QuizReviewPage,
  staticData: { header: QuizReviewPageHeader },
});
