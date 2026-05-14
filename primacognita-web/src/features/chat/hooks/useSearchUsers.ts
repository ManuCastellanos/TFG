import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/shared/hooks/useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

export function useSearchUsers(search: string) {
  const { token, userId } = useSession();
  const { chatRepository } = useDependencies();
  const uid = Number(userId);

  return useQuery({
    queryKey: ['chat', 'search', uid, search] as const,
    queryFn: () => chatRepository.searchUsers(token!, uid, search),
    enabled: !!token && !!userId && search.length >= 2,
    staleTime: 30 * 1000,
  });
}
