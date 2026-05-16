import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import QuizPreviewPage from '@/features/quiz/pages/QuizPreviewPage';
import { QuizPreviewPageHeader } from '@/features/quiz/components/QuizPreviewPageHeader';

export const quizPreviewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId',
  component: QuizPreviewPage,
  staticData: { header: QuizPreviewPageHeader },
});