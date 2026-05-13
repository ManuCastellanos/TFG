import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';

type UseOverallGradeParams = {
  courseId: string | null;
  token: string | null;
  userId: string | null;
  exercises: CourseModule[];
  sections: CourseSection[];
};

export function useOverallGrade({
  courseId, token, userId, exercises, sections,
}: UseOverallGradeParams) {
  const { assignmentRepository, quizRepository, moodleClient } = useDependencies();

  const cmidSignature = useMemo(
    () => exercises.map((m) => m.cmid).sort().join(','),
    [exercises],
  );

  const { data: scores } = useQuery({
    queryKey: ['califications', courseId, userId, cmidSignature] as const,
    queryFn: async () => {
      const courseIdNum = Number(courseId);
      const userIdNum = Number(userId);
      const scoreByCmid: Record<number, number> = {};
      const maxByCmid: Record<number, number> = {};

      const assignModules = exercises.filter((m) => m.modName === 'assign');
      const quizModules = exercises.filter((m) => m.modName === 'quiz');

      await Promise.all([
        (async () => {
          for (const am of assignModules) {
            try {
              const assignData = await assignmentRepository.getAssignment(token!, courseIdNum, am.cmid, userIdNum);
              if (!assignData?.isGraded || !assignData.grade) continue;
              scoreByCmid[am.cmid] = Number(assignData.grade.grade);
              maxByCmid[am.cmid] = assignData.maxGrade;
            } catch { /* silencio */ }
          }
        })(),

        (async () => {
          if (quizModules.length === 0) return;
          const quizzesRaw = await moodleClient
            .call<{ quizzes: Array<{ id: number; coursemodule: number; grade?: number }> }>(
              token!, 'mod_quiz_get_quizzes_by_courses', { 'courseids[0]': String(courseIdNum) },
            ).catch(() => null);

          for (const qm of quizModules) {
            try {
              const raw = quizzesRaw?.quizzes?.find((q) => q.coursemodule === qm.cmid);
              if (!raw) continue;
              maxByCmid[qm.cmid] = raw.grade ?? 10;
              const attempts = await quizRepository.getUserAttempts(token!, raw.id, userIdNum);
              const finished = attempts.filter((a) => a.state === 'finished');
              if (finished.length === 0) continue;
              const latest = finished.reduce((best, a) =>
                (a.sumGrades ?? 0) > (best.sumGrades ?? 0) ? a : best,
              );
              const review = await quizRepository.getAttemptReview(token!, latest.id).catch(() => null);
              if (review) scoreByCmid[qm.cmid] = Number(review.grade);
            } catch { /* silencio */ }
          }
        })(),
      ]);

      return { scoreByCmid, maxByCmid };
    },
    enabled: !!token && !!courseId && !!userId && exercises.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const sectionByCmid = useMemo(() => {
    const map: Record<number, { name: string; id: number }> = {};
    for (const section of sections) {
      for (const mod of section.modules) {
        map[mod.cmid] = { name: section.name, id: section.id };
      }
    }
    return map;
  }, [sections]);

  const overallGrade = useMemo(() => {
    const scoreMap = scores?.scoreByCmid ?? {};
    const maxMap = scores?.maxByCmid ?? {};

    const sectionScores = new Map<number, number[]>();
    for (const ex of exercises) {
      const secInfo = sectionByCmid[ex.cmid];
      const sectionId = secInfo?.id ?? 0;
      const score = scoreMap[ex.cmid];
      const max = maxMap[ex.cmid];
      if (score == null || max == null) continue;
      if (!sectionScores.has(sectionId)) sectionScores.set(sectionId, []);
      sectionScores.get(sectionId)!.push(score / max);
    }

    const averages: number[] = [];
    for (const ratios of sectionScores.values()) {
      if (ratios.length === 0) continue;
      const avg = ratios.reduce((s, r) => s + r, 0) / ratios.length;
      averages.push(avg * 10);
    }

    if (averages.length === 0) return null;
    const sum = averages.reduce((s, a) => s + a, 0);
    return parseFloat((sum / averages.length).toFixed(1));
  }, [exercises, sectionByCmid, scores]);

  return { overallGrade, loading: false };
}
