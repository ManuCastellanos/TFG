import type { Profile, UpdateProfileParams, UpdateAccountParams, ChangePasswordParams } from './Profile';

export default interface IProfileRepository {
  getProfile(token: string): Promise<Profile>;
  updateProfile(token: string, params: UpdateProfileParams): Promise<void>;
  updateAccount(token: string, params: UpdateAccountParams): Promise<void>;
  changePassword(token: string, params: ChangePasswordParams): Promise<void>;
}
