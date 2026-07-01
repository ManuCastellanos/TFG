import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isStudentRole } from '@/modules/user/domain/User';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { getStudentColor } from '../../../../utils/workspace-mappers';

export type Topic = {
  sectionId: number;
  sectionName: string;
  label: string;
};

export type GradebookRow = {
  studentId: string;
  userId: number;
  name: string;
  initials: string;
  gradient: string;
  averagesByTopic: Record<number, number | null>;
  overallAvg: number | null;
  trend: 'up' | 'down' | 'flat';
};

export type TeacherGradebookData = {
  topics: Topic[];
  rows: GradebookRow[];
  classAveragesByTopic: Record<number, number | null>;
  overallClassAverage: number | null;
  distribution: number[];
  passCount: number;
  topCount: number;
  riskCount: number;
  loading: boolean;
};

type Params = {
  token: string | null;
  courseId: string;
  sections: CourseSection[];
  participants: Participant[];
  assignments: { id: number; cmId: number; title: string; maxGrade: number }[];
  gradesByAssign: Record<number, GradeEntry[]>;
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return parseFloat((sum / values.length).toFixed(1));
}

export function useTeacherGradebook({
  token,
  courseId,
  sections,
  participants,
  assignments,
  gradesByAssign,
}: Params): TeacherGradebookData {
  const { quizRepository } = useDependencies();

  const students = useMemo(
    () => participants.filter((p) => isStudentRole(p.roleName)),
    [participants],
  );

  // Identify quiz modules across all sections
  const quizCmids = useMemo(() => {
    const out: number[] = [];
    for (const section of sections) {
      for (const mod of section.modules) {
        if (mod.modName === 'quiz') out.push(mod.cmid);
      }
    }
    return out;
  }, [sections]);

  const studentIdsSignature = useMemo(
    () => students.map((s) => s.id).sort().join(','),
    [students],
  );
  const quizCmidSignature = useMemo(() => quizCmids.slice().sort().join(','), [quizCmids]);

  // Fetch quiz grades for ALL students for ALL quizzes in the course.
  // Returns Record<userId, Record<cmid, normalizedScore /10>>
  const { data: quizScores, isFetching: quizScoresFetching } = useQuery({
    queryKey: ['teacherGradebookQuizScores', courseId, studentIdsSignature, quizCmidSignature] as const,
    queryFn: async () => {
      const courseIdNum = Number(courseId);
      const result: Record<number, Record<number, number>> = {};
      if (quizCmids.length === 0 || students.length === 0) return result;

      const quizzes = await quizRepository.getQuizzesByCourse(token!, courseIdNum).catch(() => []);
      const quizzesInCourse = quizzes.filter((q) => quizCmids.includes(q.cmid));
      if (quizzesInCourse.length === 0) return result;

      await Promise.all(
        students.map(async (student) => {
          const userIdNum = parseInt(student.id, 10);
          const scoreByCmid: Record<number, number> = {};
          await Promise.all(
            quizzesInCourse.map(async (quiz) => {
              try {
                const attempts = await quizRepository.getUserAttempts(token!, quiz.id, userIdNum);
                const finished = attempts.filter((a) => a.state === 'finished');
                if (finished.length === 0) return;
                const best = finished.reduce((acc, a) =>
                  (a.sumGrades ?? 0) > (acc.sumGrades ?? 0) ? a : acc,
                );
                const review = await quizRepository
                  .getAttemptReview(token!, best.id)
                  .catch(() => null);
                if (!review) return;
                const raw = parseFloat(review.grade);
                if (Number.isNaN(raw) || raw < 0) return;
                const max = quiz.gradeMax > 0 ? quiz.gradeMax : 10;
                scoreByCmid[quiz.cmid] = (raw / max) * 10;
              } catch {
                /* silencio */
              }
            }),
          );
          result[userIdNum] = scoreByCmid;
        }),
      );

      return result;
    },
    enabled: !!token && !!courseId && quizCmids.length > 0 && students.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  return useMemo(() => {
    // Topics from non-general sections (id !== 0) that contain at least one gradable activity
    const topics: Topic[] = [];
    const cmidToSectionId: Record<number, number> = {};

    for (const section of sections) {
      if (section.id === 0) continue;
      const hasGradable = section.modules.some(
        (m) => m.modName === 'assign' || m.modName === 'quiz',
      );
      if (!hasGradable) continue;
      topics.push({
        sectionId: section.id,
        sectionName: section.name,
        label: section.name,
      });
      for (const mod of section.modules) {
        cmidToSectionId[mod.cmid] = section.id;
      }
    }

    // assignId -> sectionId, and assignId -> maxGrade
    const assignIdToSectionId = new Map<number, number>();
    const assignIdToMaxGrade = new Map<number, number>();
    for (const a of assignments) {
      const sid = cmidToSectionId[a.cmId];
      if (sid != null) assignIdToSectionId.set(a.id, sid);
      assignIdToMaxGrade.set(a.id, a.maxGrade > 0 ? a.maxGrade : 10);
    }

    const rows: GradebookRow[] = students.map((s) => {
      const userId = parseInt(s.id, 10);

      const gradesByTopic: Record<number, number[]> = {};
      for (const topic of topics) gradesByTopic[topic.sectionId] = [];

      // Assignment grades
      for (const a of assignments) {
        const sid = assignIdToSectionId.get(a.id);
        if (sid == null) continue;
        const grades = gradesByAssign[a.id] ?? [];
        const entry = grades.find((g) => g.userId === userId);
        if (!entry) continue;
        const raw = parseFloat(entry.grade);
        if (Number.isNaN(raw) || raw < 0) continue;
        const max = assignIdToMaxGrade.get(a.id) ?? 10;
        gradesByTopic[sid].push((raw / max) * 10);
      }

      // Quiz grades (already normalized to /10 in quizScores)
      const userQuizScores = quizScores?.[userId] ?? {};
      for (const [cmidStr, score] of Object.entries(userQuizScores)) {
        const cmid = Number(cmidStr);
        const sid = cmidToSectionId[cmid];
        if (sid == null) continue;
        if (!(sid in gradesByTopic)) continue;
        gradesByTopic[sid].push(score);
      }

      const averagesByTopic: Record<number, number | null> = {};
      for (const topic of topics) {
        averagesByTopic[topic.sectionId] = average(gradesByTopic[topic.sectionId]);
      }

      const topicAverages = topics
        .map((t) => averagesByTopic[t.sectionId])
        .filter((v): v is number => v != null);
      const overallAvg = average(topicAverages);

      const color = getStudentColor(userId);

      return {
        studentId: s.id,
        userId,
        name: s.fullName,
        initials: getInitials(s.fullName),
        gradient: color.grad,
        averagesByTopic,
        overallAvg,
        trend: 'flat',
      };
    });

    const classAveragesByTopic: Record<number, number | null> = {};
    for (const topic of topics) {
      const vals = rows
        .map((r) => r.averagesByTopic[topic.sectionId])
        .filter((v): v is number => v != null);
      classAveragesByTopic[topic.sectionId] = average(vals);
    }

    const studentAverages = rows.map((r) => r.overallAvg).filter((v): v is number => v != null);
    const overallClassAverage = average(studentAverages);

    const distribution = [0, 0, 0, 0, 0];
    for (const r of rows) {
      if (r.overallAvg == null) continue;
      const bin = Math.min(4, Math.floor(r.overallAvg / 2));
      distribution[bin]++;
    }

    const passCount = rows.filter((r) => r.overallAvg != null && r.overallAvg >= 5).length;
    const topCount = rows.filter((r) => r.overallAvg != null && r.overallAvg >= 9).length;
    const riskCount = rows.filter((r) => r.overallAvg != null && r.overallAvg < 5).length;

    return {
      topics,
      rows,
      classAveragesByTopic,
      overallClassAverage,
      distribution,
      passCount,
      topCount,
      riskCount,
      loading: quizScoresFetching,
    };
  }, [sections, students, assignments, gradesByAssign, quizScores, quizScoresFetching]);
}
