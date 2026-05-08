import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizPreviewPage from '@/features/quiz/pages/QuizPreviewPage';

export const quizPreviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId',
  component: QuizPreviewPage,
});