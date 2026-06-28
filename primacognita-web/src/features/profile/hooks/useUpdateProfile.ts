import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { UpdateProfileParams } from '@/modules/profile/domain/Profile';

export const useUpdateProfile = (userId: string | null, token: string | null) => {
  const { profileRepository } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProfileParams) => profileRepository.updateProfile(token!, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(userId ?? '') });
    },
  });
};
