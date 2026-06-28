import { useState } from 'react';
import { useUpdateProfile } from './useUpdateProfile';
import { useUpdateAccount } from './useUpdateAccount';
import { useChangePassword } from './useChangePassword';
import type { UpdateProfileParams, UpdateAccountParams, ChangePasswordParams } from '@/modules/profile/domain/Profile';

type AboutFields = Pick<UpdateProfileParams, 'superpoder' | 'cumpleanos' | 'animal' | 'talento'>;
type FamilyFields = Pick<UpdateProfileParams, 'tutor1_nombre' | 'tutor1_email' | 'tutor1_telefono' | 'tutor2_nombre' | 'tutor2_email' | 'tutor2_telefono'>;

export function useProfileActions(userId: string | null, token: string | null) {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile(userId, token);
  const updateAccountMutation = useUpdateAccount(userId, token);
  const changePasswordMutation = useChangePassword(token);

  const saveAbout = (params: AboutFields) =>
    updateProfileMutation.mutateAsync(params as UpdateProfileParams);

  const saveFamily = (params: FamilyFields) =>
    updateProfileMutation.mutateAsync(params as UpdateProfileParams);

  const saveAccount = (params: UpdateAccountParams) =>
    updateAccountMutation.mutateAsync(params);

  const changePassword = async (params: ChangePasswordParams): Promise<boolean> => {
    setPasswordError(null);
    try {
      await changePasswordMutation.mutateAsync(params);
      return true;
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
      return false;
    }
  };

  const clearPasswordError = () => setPasswordError(null);

  return {
    saveAbout,
    saveFamily,
    saveAccount,
    changePassword,
    savingProfile:  updateProfileMutation.isPending,
    savingAccount:  updateAccountMutation.isPending,
    savingPassword: changePasswordMutation.isPending,
    passwordError,
    clearPasswordError,
  };
}
