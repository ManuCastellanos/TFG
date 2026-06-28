import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { Profile } from '@/modules/profile/domain/Profile';

type UseProfileResult = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useProfile = (userId: string | null, token: string | null): UseProfileResult => {
  const { profileRepository } = useDependencies();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.profile.detail(userId ?? ''),
    queryFn: () => profileRepository.getProfile(token!),
    enabled: !!userId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  return {
    profile: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
