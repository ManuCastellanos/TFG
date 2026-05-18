import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/hooks/queryKeys';
import { CreateQuizView } from './CreateQuizView';
import { useCreateQuiz } from '../hooks/useCreateQuiz';
import type { CreateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';

export default function CreateQuizPage() {
  const { courseId, sectionNum } = useParams({ strict: false }) as {
    courseId: string;
    sectionNum: string;
  };
  const navigate = useNavigate();
  const { token } = useSession();
  const { quizRepository } = useDependencies();
  const queryClient = useQueryClient();
  const { form } = useCreateQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: CreateQuizInput) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const { cmid } = await quizRepository.createQuiz(token, input);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.contents(courseId) });
      void navigate({
        to: '/courses/$courseId/quiz/$quizId/questions',
        params: { courseId, quizId: String(cmid) },
        replace: true,
      });
    } catch (err) {
      setError((err as Error).message ?? 'Error al crear el cuestionario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    void navigate({ to: '/courses/$id', params: { id: courseId }, replace: true });
  };

  return (
    <CreateQuizView
      form={form}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      error={error}
      courseId={Number(courseId)}
      sectionNum={Number(sectionNum)}
    />
  );
}
