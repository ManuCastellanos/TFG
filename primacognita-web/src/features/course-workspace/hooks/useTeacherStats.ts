import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { SubmissionEntry } from '@/modules/assignment/domain/SubmissionEntry';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';

export function useTeacherStats(
  token: string | null,
  courseId: string,
): {
  assignments: { id: number; cmId: number; title: string }[];
  submissionsByAssign: Record<number, SubmissionEntry[]>;
  gradesByAssign: Record<number, GradeEntry[]>;
  loading: boolean;
  error: string | null;
} {
  const { assignmentRepository } = useDependencies();
  const [assignments, setAssignments] = useState<{ id: number; cmId: number; title: string }[]>([]);
  const [submissionsByAssign, setSubmissionsByAssign] = useState<Record<number, SubmissionEntry[]>>({});
  const [gradesByAssign, setGradesByAssign] = useState<Record<number, GradeEntry[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token || !courseId) return;
    setLoading(true);
    setError(null);

    try {
      const courseIdNum = parseInt(courseId, 10);
      const fetched = await assignmentRepository.getAssignmentsForCourse(token, courseIdNum);
      setAssignments(fetched.map((a) => ({ id: a.id, cmId: a.cmId, title: a.title })));
      if (fetched.length === 0) {
        setSubmissionsByAssign({});
        setGradesByAssign({});
        setLoading(false);
        return;
      }

      const assignIds = fetched.map((a) => a.id);
      const [subsMap, gradesMap] = await Promise.all([
        assignmentRepository.getSubmissionsForAssignments(token, assignIds),
        assignmentRepository.getGradesForAssignments(token, assignIds),
      ]);

      setSubmissionsByAssign(subsMap);
      setGradesByAssign(gradesMap);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error fetching teacher stats');
    } finally {
      setLoading(false);
    }
  }, [assignmentRepository, token, courseId]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { assignments, submissionsByAssign, gradesByAssign, loading, error };
}
