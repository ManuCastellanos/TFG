import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { TopicGrade } from '../types/califications.types';

type UseCalificationsParams = {
  courseId: string | null;
  token: string | null;
  userId: string | null;
  exercises: CourseModule[];
  sections: CourseSection[];
};

type CalificationsData = {
  overallGrade: number | null;
  topicGrades: TopicGrade[];
  loading: boolean;
};

export function useCalifications({
  courseId,
  token,
  userId,
  exercises,
  sections,
}: UseCalificationsParams): CalificationsData {
  const { assignmentRepository, quizRepository } = useDependencies();

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

          const quizzes = await quizRepository.getQuizzesByCourse(token!, courseIdNum).catch(() => []);
          const quizByCmid = new Map(quizzes.map((q) => [q.cmid, q]));

          for (const qm of quizModules) {
            try {
              const quiz = quizByCmid.get(qm.cmid);
              if (!quiz) continue;
              maxByCmid[qm.cmid] = quiz.gradeMax;

              const attempts = await quizRepository.getUserAttempts(token!, quiz.id, userIdNum);
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

  const topicGrades = useMemo<TopicGrade[]>(() => {
    const scoreByCmid = scores?.scoreByCmid ?? {};
    const maxByCmid = scores?.maxByCmid ?? {};

    const sectionMap = new Map<number, TopicGrade>();

    for (const ex of exercises) {
      const secInfo = sectionByCmid[ex.cmid];
      const sectionId = secInfo?.id ?? 0;
      const sectionName = secInfo?.name ?? 'General';

      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, {
          sectionId,
          sectionName,
          sectionNumber: sectionId,
          averageScore: null,
          maxScore: 10,
          totalItems: 0,
          completedItems: 0,
          exercises: [],
        });
      }

      const topic = sectionMap.get(sectionId)!;
      const score = scoreByCmid[ex.cmid] ?? null;
      const max = maxByCmid[ex.cmid] ?? null;

      topic.exercises.push({
        id: ex.id,
        cmid: ex.cmid,
        modName: ex.modName,
        title: ex.name,
        kind: ex.modName,
        score,
        max,
      });
      topic.totalItems++;
      if (score != null) topic.completedItems++;
    }

    // Sort sections by id
    const sorted = [...sectionMap.values()].sort((a, b) => a.sectionId - b.sectionId);

    // Assign section numbers and compute averages
    let num = 1;
    for (const topic of sorted) {
      topic.sectionNumber = num++;
      const scored = topic.exercises.filter((e) => e.score != null && e.max != null);
      if (scored.length > 0) {
        const totalPct = scored.reduce((sum, e) => sum + (e.score! / e.max!), 0);
        topic.averageScore = parseFloat(((totalPct / scored.length) * 10).toFixed(1));
        topic.maxScore = 10;
      }
    }

    // Renumber
    sorted.forEach((t, i) => { t.sectionNumber = i + 1; });

    return sorted;
  }, [exercises, sectionByCmid, scores]);

  const overallGrade = useMemo(() => {
    const scored = topicGrades.filter((t) => t.averageScore != null);
    if (scored.length === 0) return null;
    const sum = scored.reduce((s, t) => s + t.averageScore!, 0);
    return parseFloat((sum / scored.length).toFixed(1));
  }, [topicGrades]);

  return { overallGrade, topicGrades, loading: false };
}
