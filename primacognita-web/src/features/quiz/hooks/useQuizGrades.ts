import { useCallback, useEffect, useState } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { isStudentRole } from '@/modules/user/domain/User';
import type { QuizMeta } from '@/modules/quiz/domain/IQuizRepository';
import type { StudentQuizAttempt } from '@/modules/quiz/domain/StudentQuizAttempt';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

type UseQuizGradesResult = {
  meta: QuizMeta | null;
  students: StudentQuizAttempt[];
  loading: boolean;
  error: string | null;
};

export function useQuizGrades(token: string | null, courseId: string, cmid: string): UseQuizGradesResult {
  const { quizRepository, courseRepository } = useDependencies();
  const [meta, setMeta] = useState<QuizMeta | null>(null);
  const [students, setStudents] = useState<StudentQuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const courseIdNum = parseInt(courseId, 10);
      const cmidNum = parseInt(cmid, 10);

      const [quizMeta, participants] = await Promise.all([
        quizRepository.getQuizByCmid(token, courseIdNum, cmidNum),
        courseRepository.getEnrolledUsers(token, courseId),
      ]);

      setMeta(quizMeta);

      if (!quizMeta) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const studentParticipants = participants.filter((p) => isStudentRole(p.roleName));

      const attemptsByStudent = await Promise.all(
        studentParticipants.map((s) => quizRepository.getUserAttempts(token, quizMeta.id, parseInt(s.id, 10))),
      );

      const enriched: StudentQuizAttempt[] = studentParticipants.map((student, i) => {
        const attempts = attemptsByStudent[i];
        const uid = parseInt(student.id, 10);
        const hasInProgress = attempts.some((a) => a.state === 'inprogress');
        const finished = attempts.filter((a) => a.state === 'finished');
        const bestFinished =
          finished.length > 0
            ? finished.reduce((best, a) => ((a.sumGrades ?? 0) > (best.sumGrades ?? 0) ? a : best))
            : null;

        let bestGrade: string | null = null;
        if (bestFinished?.sumGrades != null && quizMeta.sumgrades && quizMeta.sumgrades > 0) {
          bestGrade = (bestFinished.sumGrades * (quizMeta.gradeMax / quizMeta.sumgrades)).toFixed(2);
        }

        return {
          userId: uid,
          userFullName: student.fullName,
          userInitials: getInitials(student.fullName),
          colorIdx: uid % 6,
          status: finished.length > 0 ? 'graded' : hasInProgress ? 'in_progress' : 'not_attempted',
          bestGrade,
          attemptsCount: attempts.length,
          lastAttemptId: bestFinished?.id ?? null,
        };
      });

      enriched.sort((a, b) => {
        const order: Record<StudentQuizAttempt['status'], number> = {
          graded: 0,
          in_progress: 1,
          not_attempted: 2,
        };
        return order[a.status] - order[b.status];
      });

      setStudents(enriched);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [token, courseId, cmid, quizRepository, courseRepository]);

  useEffect(() => {
    void load();
  }, [load]);

  return { meta, students, loading, error };
}
