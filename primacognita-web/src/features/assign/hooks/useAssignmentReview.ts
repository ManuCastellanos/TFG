import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { isStudentRole } from '@/modules/user/domain/User';
import type { AssignmentMeta } from '@/modules/assignment/domain/AssignmentMeta';
import type { StudentSubmission } from '@/modules/assignment/domain/StudentSubmission';

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return fullName.slice(0, 2).toUpperCase();
}

type UseAssignmentReviewResult = {
  assignment: AssignmentMeta | null;
  submissions: StudentSubmission[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveGrade: (userId: number, grade: number, feedback: string) => Promise<void>;
  refetch: () => Promise<void>;
};

export function useAssignmentReview(
  token: string | null,
  courseId: string,
  cmid: string,
): UseAssignmentReviewResult {
  const { assignmentRepository, courseRepository } = useDependencies();
  const [assignment, setAssignment] = useState<AssignmentMeta | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const courseIdNum = parseInt(courseId, 10);
      const cmidNum = parseInt(cmid, 10);

      const [assignments, participants] = await Promise.all([
        assignmentRepository.getAssignmentsForCourse(token, courseIdNum),
        courseRepository.getEnrolledUsers(token, courseId),
      ]);

      const meta = assignments.find((a) => a.cmId === cmidNum) ?? null;
      setAssignment(meta);

      if (!meta) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const [submissionsByAssign, gradesByAssign] = await Promise.all([
        assignmentRepository.getSubmissionsForAssignments(token, [meta.id]),
        assignmentRepository.getGradesForAssignments(token, [meta.id]),
      ]);

      const rawSubs = submissionsByAssign[meta.id] ?? [];
      const rawGrades = gradesByAssign[meta.id] ?? [];

      const gradeByUserId = new Map(rawGrades.map((g) => [g.userId, g]));
      const subByUserId = new Map(rawSubs.map((s) => [s.userId, s]));

      const students = participants.filter((p) => isStudentRole(p.roleName));

      const enriched: StudentSubmission[] = students.map((student) => {
        const uid = parseInt(student.id, 10);
        const sub = subByUserId.get(uid);
        const grade = gradeByUserId.get(uid);

        let status: StudentSubmission['status'];
        if (grade) {
          status = 'graded';
        } else if (!sub || sub.status === 'new') {
          status = 'missing';
        } else if (
          meta.dueDate &&
          sub.submittedAt &&
          sub.submittedAt > meta.dueDate
        ) {
          status = 'late';
        } else {
          status = 'submitted';
        }

        return {
          userId: uid,
          userFullName: student.fullName,
          userInitials: getInitials(student.fullName),
          colorIdx: uid % 6,
          status,
          submittedAt: sub?.submittedAt,
          files: sub?.files ?? [],
          gradeStr: grade?.grade,
          note: sub?.note,
        };
      });

      enriched.sort((a, b) => {
        const order: Record<StudentSubmission['status'], number> = {
          submitted: 0,
          late: 1,
          graded: 2,
          missing: 3,
        };
        return order[a.status] - order[b.status];
      });

      setSubmissions(enriched);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar las entregas');
    } finally {
      setLoading(false);
    }
  }, [token, courseId, cmid, assignmentRepository, courseRepository]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveGrade = useCallback(
    async (userId: number, grade: number, feedback: string) => {
      if (!token || !assignment) return;
      setSaving(true);
      try {
        await assignmentRepository.saveGrade(token, assignment.id, userId, grade, feedback);
        await load();
      } finally {
        setSaving(false);
      }
    },
    [token, assignment, assignmentRepository, load],
  );

  return { assignment, submissions, loading, error, saving, saveGrade, refetch: load };
}
