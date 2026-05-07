import { useEffect, useState } from 'react';
import type { UserAttempt } from '@/modules/quiz/domain/IQuizRepository';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

export type UseQuizPreviewResult = {
  attempts: UserAttempt[];
  loading: boolean;
  attemptsError: string | null;
};

export function useQuizPreview(quizId: number | null): UseQuizPreviewResult {
  const { quizRepository } = useDependencies();
  const { token, userId } = useSession();

  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !userId || quizId == null) return;
    let cancelled = false;

    const fetchAttempts = async () => {
      setLoading(true);
      setAttemptsError(null);
      try {
        const result = await quizRepository.getUserAttempts(token, quizId, userId);
        if (!cancelled) setAttempts(result);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Error al cargar intentos';
          setAttemptsError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchAttempts();
    return () => { cancelled = true; };
  }, [quizRepository, token, userId, quizId]);

  return { attempts, loading, attemptsError };
}
