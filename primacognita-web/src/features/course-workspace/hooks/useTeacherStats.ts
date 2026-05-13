import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
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

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.assignments.meta(Number(courseId)),
    queryFn: async () => {
      const courseIdNum = Number(courseId);
      const fetched = await assignmentRepository.getAssignmentsForCourse(token!, courseIdNum);

      const assignments = fetched.map((a) => ({ id: a.id, cmId: a.cmId, title: a.title }));

      if (fetched.length === 0) {
        return { assignments, submissionsByAssign: {} as Record<number, SubmissionEntry[]>, gradesByAssign: {} as Record<number, GradeEntry[]> };
      }

      const assignIds = fetched.map((a) => a.id);
      const [subsMap, gradesMap] = await Promise.all([
        assignmentRepository.getSubmissionsForAssignments(token!, assignIds),
        assignmentRepository.getGradesForAssignments(token!, assignIds),
      ]);

      return {
        assignments,
        submissionsByAssign: subsMap,
        gradesByAssign: gradesMap,
      };
    },
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  return {
    assignments: data?.assignments ?? [],
    submissionsByAssign: data?.submissionsByAssign ?? {},
    gradesByAssign: data?.gradesByAssign ?? {},
    loading: isLoading,
    error: error?.message ?? null,
  };
}
