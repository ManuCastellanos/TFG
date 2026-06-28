import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';
import type { UpdateAccountParams } from '@/modules/profile/domain/Profile';

export const useUpdateAccount = (userId: string | null, token: string | null) => {
  const { profileRepository } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateAccountParams) => profileRepository.updateAccount(token!, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail(userId ?? '') });
    },
  });
};
