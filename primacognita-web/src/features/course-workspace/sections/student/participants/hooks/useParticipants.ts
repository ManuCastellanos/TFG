import { useQuery } from '@tanstack/react-query';
import type { Participant } from '@/modules/course/domain/Participant';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

type UseParticipantsResult = {
  participants: Participant[];
  loading: boolean;
  error: string | null;
};

export const useParticipants = (token: string | null, courseId: string | null): UseParticipantsResult => {
  const { courseRepository } = useDependencies();

  const { data: participants = [], isLoading, error } = useQuery({
    queryKey: ['participants', courseId] as const,
    queryFn: () => courseRepository.getEnrolledUsers(token!, courseId!),
    enabled: !!token && !!courseId,
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
  });

  return {
    participants,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
