import { useCallback, useState } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import type { CreateCourseInput } from '@/modules/course/domain/CreateCourseInput';
import type { CourseId } from '@/modules/course/domain/Course';

type UseCreateCourseResult = {
  submit: (input: CreateCourseInput, imageFile?: File) => Promise<CourseId>;
  loading: boolean;
  error: string | null;
};

export const useCreateCourse = (): UseCreateCourseResult => {
  const { token, userId } = useSession();
  const { courseRepository } = useDependencies();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (input: CreateCourseInput, imageFile?: File): Promise<CourseId> => {
      if (!token || !userId) throw new Error('No hay sesión activa');
      setLoading(true);
      setError(null);
      try {
        const courseId = await courseRepository.createCourseWithImage(token, input, imageFile);
        await courseRepository.enrollTeacherInCourse(token, userId, courseId);
        return courseId;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [token, userId, courseRepository],
  );

  return { submit, loading, error };
};
