import { useQuery } from '@tanstack/react-query';
import { useSession } from './useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from './queryKeys';
import type { User } from '@/modules/user/domain/User';

type UseCurrentUserResult = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export function useCurrentUser(): UseCurrentUserResult {
  const { token, isAuthenticated } = useSession();
  const { userRepository, userSessionStore } = useDependencies();

  const { data: user, isLoading, error } = useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      const fetched = await userRepository.getCurrentUser(token!);
      userSessionStore.save(fetched);
      return fetched;
    },
    enabled: !!token && isAuthenticated,
    staleTime: Infinity,
    placeholderData: () => userSessionStore.get(),
  });

  return { user: user ?? null, isLoading, error: error ?? null };
}
