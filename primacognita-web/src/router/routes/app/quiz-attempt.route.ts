import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizAttemptPage from '@/features/quiz/pages/QuizAttemptPage';

export const quizAttemptRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId/attempt',
  component: QuizAttemptPage,
});
