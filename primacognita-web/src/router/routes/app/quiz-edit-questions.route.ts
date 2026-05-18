import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import EditQuestionsPage from '@/features/quiz/pages/EditQuestionsPage';

export const quizEditQuestionsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/$quizId/questions',
  component: EditQuestionsPage,
});
