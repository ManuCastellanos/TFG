import type { Profile, UpdateProfileParams, UpdateAccountParams, ChangePasswordParams } from '@/modules/profile/domain/Profile';

export default interface IMoodleProfileApi {
  getProfile(token: string, userId: string): Promise<Profile>;
  updateProfile(token: string, params: UpdateProfileParams, userId: string): Promise<void>;
  updateAccount(token: string, params: UpdateAccountParams): Promise<void>;
  changePassword(token: string, params: ChangePasswordParams): Promise<void>;
}
