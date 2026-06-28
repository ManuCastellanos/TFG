import type { Profile, UpdateProfileParams } from '@/modules/profile/domain/Profile';

export default interface IMoodleProfileApi {
  getProfile(token: string): Promise<Profile>;
  updateProfile(token: string, params: UpdateProfileParams): Promise<void>;
}
