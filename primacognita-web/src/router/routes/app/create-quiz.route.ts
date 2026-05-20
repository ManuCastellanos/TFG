import { createRoute } from '@tanstack/react-router';
import { layoutRoute } from './layout.route';
import CreateQuizPage from '@/features/create-quiz/pages/CreateQuizPage';
import { CreateQuizPageHeader } from '@/features/create-quiz/components/CreateQuizPageHeader';

export const createQuizRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/courses/$courseId/quiz/create/$sectionNum',
  component: CreateQuizPage,
  staticData: { header: CreateQuizPageHeader },
});
