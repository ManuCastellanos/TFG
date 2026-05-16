import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizAttemptPage from '@/features/quiz/pages/QuizAttemptPage';
import { QuizAttemptPageHeader } from '@/features/quiz/components/QuizAttemptPageHeader';

export const quizAttemptRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId/attempt',
  component: QuizAttemptPage,
  staticData: { header: QuizAttemptPageHeader },
});