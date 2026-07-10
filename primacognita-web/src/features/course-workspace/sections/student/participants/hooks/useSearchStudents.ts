import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

export function useSearchStudents(search: string) {
  const { token } = useSession();
  const { userRepository } = useDependencies();

  return useQuery({
    queryKey: ['users', 'search', search] as const,
    queryFn: () => userRepository.searchUsers(token!, search),
    enabled: !!token && search.length >= 2,
    staleTime: 30 * 1000,
  });
}
