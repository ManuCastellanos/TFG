import { useMutation } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { ChangePasswordParams } from '@/modules/profile/domain/Profile';

export const useChangePassword = (token: string | null) => {
  const { profileRepository } = useDependencies();

  return useMutation({
    mutationFn: (params: ChangePasswordParams) => profileRepository.changePassword(token!, params),
  });
};
