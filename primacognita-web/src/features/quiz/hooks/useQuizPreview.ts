import { useEffect, useState } from 'react';
import type { UserAttempt, QuizMeta } from '@/modules/quiz/domain/IQuizRepository';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

export type UseQuizPreviewResult = {
  attempts: UserAttempt[];
  loading: boolean;
  attemptsError: string | null;
  bestGrade: string | null;
  attemptGrades: Record<number, string>;
};

function scaleGrade(sumGrades: number, quizSumgrades: number, gradeMax: number): string {
  if (quizSumgrades <= 0) return '0.00';
  return (sumGrades * (gradeMax / quizSumgrades)).toFixed(2);
}

export function useQuizPreview(quizId: number | null, meta?: QuizMeta | null): UseQuizPreviewResult {
  const { quizRepository } = useDependencies();
  const { token, userId } = useSession();

  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);
  const [bestGrade, setBestGrade] = useState<string | null>(null);
  const [attemptGrades, setAttemptGrades] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!token || !userId || quizId == null) return;
    let cancelled = false;

    const fetchAttempts = async () => {
      setLoading(true);
      setAttemptsError(null);
      try {
        const result = await quizRepository.getUserAttempts(token, quizId, Number(userId));
        if (cancelled) return;
        setAttempts(result);

        const finished = result.filter((a) => a.state === 'finished');
        if (finished.length > 0) {
          const reviews = await Promise.allSettled(
            finished.map((a) => quizRepository.getAttemptReview(token, a.id)),
          );

          const gradesMap: Record<number, string> = {};
          finished.forEach((a, i) => {
            const r = reviews[i];
            if (r.status === 'fulfilled' && r.value.grade) {
              gradesMap[a.id] = r.value.grade;
            } else if (
              a.sumGrades != null &&
              meta?.sumgrades != null &&
              meta.sumgrades > 0 &&
              meta.gradeMax != null
            ) {
              gradesMap[a.id] = scaleGrade(a.sumGrades, meta.sumgrades, meta.gradeMax);
            }
          });

          if (!cancelled) {
            setAttemptGrades(gradesMap);
            const gradeValues = Object.values(gradesMap);
            if (gradeValues.length > 0) {
              const best = gradeValues.reduce((b, g) =>
                parseFloat(g) > parseFloat(b) ? g : b,
              );
              setBestGrade(best);
            }
          }
        }
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
  }, [quizRepository, token, userId, quizId, meta]);

  return { attempts, loading, attemptsError, bestGrade, attemptGrades };
}
