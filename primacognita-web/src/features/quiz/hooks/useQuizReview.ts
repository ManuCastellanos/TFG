import { useEffect, useState } from 'react';
import type { AttemptReviewData } from '@/modules/quiz/domain/IQuizRepository';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseQuizReviewResult = {
  review: AttemptReviewData | null;
  loading: boolean;
  error: string | null;
};

export function useQuizReview(attemptId: number): UseQuizReviewResult {
  const { quizRepository } = useDependencies();
  const { token } = useSession();

  const [review, setReview] = useState<AttemptReviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await quizRepository.getAttemptReview(token, attemptId);
        if (!cancelled) setReview(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar la revisión.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [quizRepository, token, attemptId]);

  return { review, loading, error };
}
