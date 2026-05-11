import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { isStudentRole } from '@/modules/user/domain/User';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';

export type PendingItem = {
  activityName: string;
  activityKind: 'assign';
  assignId: number;
  cmId: number;
  userId: number;
  userName: string;
  submittedAt: number;
};

export type TeacherStats = {
  studentsCount: number;
  activeCount: number;
  pendingTotal: number;
  pendingByModule: Record<number, number>;
  sectionProgress: Record<number, number>;
  progressByStudent: Record<string, number>;
  pendingItems: PendingItem[];
  loading: boolean;
  error: string | null;
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function useTeacherStats(
  token: string | null,
  courseId: string,
  sections: CourseSection[],
  participants: Participant[],
): TeacherStats {
  const { assignmentRepository } = useDependencies();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingByModule, setPendingByModule] = useState<Record<number, number>>({});
  const [sectionProgress, setSectionProgress] = useState<Record<number, number>>({});
  const [progressByStudent, setProgressByStudent] = useState<Record<string, number>>({});
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [pendingTotal, setPendingTotal] = useState(0);

  const students = useMemo(
    () => participants.filter((p) => isStudentRole(p.roleName)),
    [participants],
  );

  const activeCount = useMemo(() => {
    const weekAgo = Date.now() - WEEK_MS;
    return students.filter((s) => (s.lastCourseAccess ?? 0) >= weekAgo).length;
  }, [students]);

  const fetch = useCallback(async () => {
    if (!token || !courseId || sections.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const courseIdNum = parseInt(courseId, 10);
      const assignments = await assignmentRepository.getAssignmentsForCourse(token, courseIdNum);
      if (assignments.length === 0) {
        setLoading(false);
        return;
      }

      const assignIds = assignments.map((a) => a.id);
      const cmidToAssign = Object.fromEntries(assignments.map((a) => [a.cmId, a]));

      const [submissionsByAssign, gradesByAssign] = await Promise.all([
        assignmentRepository.getSubmissionsForAssignments(token, assignIds),
        assignmentRepository.getGradesForAssignments(token, assignIds),
      ]);

      const pendingMap: Record<number, number> = {};
      const items: PendingItem[] = [];
      let total = 0;

      for (const assign of assignments) {
        const subs = submissionsByAssign[assign.id] ?? [];
        const grades = gradesByAssign[assign.id] ?? [];
        const gradedUserIds = new Set(grades.map((g) => g.userId));

        const pending = subs.filter(
          (s) => s.status === 'submitted' && !gradedUserIds.has(s.userId),
        );
        pendingMap[assign.cmId] = pending.length;
        total += pending.length;

        for (const sub of pending) {
          const participant = participants.find((p) => parseInt(p.id, 10) === sub.userId);
          items.push({
            activityName: assign.title,
            activityKind: 'assign',
            assignId: assign.id,
            cmId: assign.cmId,
            userId: sub.userId,
            userName: participant?.fullName ?? `Usuario ${sub.userId}`,
            submittedAt: sub.submittedAt ?? 0,
          });
        }
      }

      items.sort((a, b) => b.submittedAt - a.submittedAt);

      const progressMap: Record<number, number> = {};
      const studentsNum = students.length;
      for (const section of sections) {
        const assignModules = section.modules.filter((m) => m.modName === 'assign');
        if (assignModules.length === 0 || studentsNum === 0) {
          progressMap[section.id] = 0;
          continue;
        }
        const expected = assignModules.length * studentsNum;
        let received = 0;
        for (const mod of assignModules) {
          const assign = cmidToAssign[mod.cmid];
          if (!assign) continue;
          const subs = submissionsByAssign[assign.id] ?? [];
          const grades = gradesByAssign[assign.id] ?? [];
          const gradedIds = new Set(grades.map((g) => g.userId));
          received += subs.filter(
            (s) => s.status === 'submitted' || gradedIds.has(s.userId),
          ).length;
        }
        progressMap[section.id] = Math.round((received / expected) * 100);
      }

      const studentProgressMap: Record<string, number> = {};
      const totalAssigns = assignments.length;
      for (const student of students) {
        const uid = parseInt(student.id, 10);
        let done = 0;
        for (const assign of assignments) {
          const grades = gradesByAssign[assign.id] ?? [];
          const subs = submissionsByAssign[assign.id] ?? [];
          if (grades.some((g) => g.userId === uid)) {
            done++;
          } else if (subs.some((s) => s.userId === uid && s.status === 'submitted')) {
            done++;
          }
        }
        studentProgressMap[student.id] = totalAssigns > 0 ? Math.round((done / totalAssigns) * 100) : 0;
      }

      setPendingByModule(pendingMap);
      setSectionProgress(progressMap);
      setProgressByStudent(studentProgressMap);
      setPendingItems(items);
      setPendingTotal(total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [token, courseId, sections, participants, students, assignmentRepository]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    studentsCount: students.length,
    activeCount,
    pendingTotal,
    pendingByModule,
    sectionProgress,
    progressByStudent,
    pendingItems,
    loading,
    error,
  };
}
