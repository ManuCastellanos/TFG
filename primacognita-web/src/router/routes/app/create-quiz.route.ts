import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CreateQuizPage from '@/features/create-quiz/pages/CreateQuizPage';

export const createQuizRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/create/$sectionNum',
  component: CreateQuizPage,
});
