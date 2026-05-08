import { useCallback, useEffect, useState } from 'react';
import type { QuizMeta } from '@/modules/quiz/domain/IQuizRepository';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseQuizMetaResult = {
  meta: QuizMeta | null;
  loading: boolean;
  error: string | null;
};

export function useQuizMeta(courseId: string | null, cmid: string | null): UseQuizMetaResult {
  const { quizRepository } = useDependencies();
  const { token } = useSession();

  const [meta, setMeta] = useState<QuizMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeta = useCallback(async () => {
    if (!token || !courseId || !cmid) return;

    setLoading(true);
    setError(null);

    try {
      const data = await quizRepository.getQuizByCmid(token, Number(courseId), Number(cmid));
      if (!data) {
        setError('Cuestionario no encontrado.');
        return;
      }
      setMeta(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el cuestionario.');
    } finally {
      setLoading(false);
    }
  }, [quizRepository, token, courseId, cmid]);

  useEffect(() => {
    void fetchMeta();
  }, [fetchMeta]);

  return { meta, loading, error };
}
