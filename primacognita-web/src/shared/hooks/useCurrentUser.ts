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

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      const cached = userSessionStore.get();
      const cachedRole = cached ? { roleId: cached.roleId ?? null, roleName: cached.roleName ?? null } : undefined;
      const fetched = await userRepository.getCurrentUser(token!, cachedRole);
      userSessionStore.save(fetched);
      return fetched;
    },
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000,
    placeholderData: () => userSessionStore.get() ?? undefined,
  });

  return { user: user ?? null, isLoading, error: error ?? null };
}
