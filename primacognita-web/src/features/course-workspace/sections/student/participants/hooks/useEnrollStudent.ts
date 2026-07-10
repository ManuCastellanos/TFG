import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { CourseId } from '@/modules/course/domain/Course';

export function useEnrollStudent(courseId: CourseId | null) {
  const { token } = useSession();
  const { courseRepository } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentUserId: string) =>
      courseRepository.enrollStudentInCourse(token!, studentUserId, courseId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', courseId] });
    },
  });
}
