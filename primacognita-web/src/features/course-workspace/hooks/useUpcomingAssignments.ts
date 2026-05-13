import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';

type Result = {
  upcoming: UpcomingAssignment[];
  loading: boolean;
};

export function useUpcomingAssignments(courseId: string): Result {
  const { assignmentRepository } = useDependencies();
  const { token, userId } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.assignments.upcoming(courseId),
    queryFn: () =>
      assignmentRepository.getUpcomingAssignments(token!, Number(courseId), Number(userId!)),
    enabled: !!token && !!userId && !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  return { upcoming: data ?? [], loading: isLoading };
}
