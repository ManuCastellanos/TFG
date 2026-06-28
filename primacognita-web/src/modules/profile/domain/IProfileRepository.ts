import type { Profile, UpdateProfileParams } from './Profile';

export default interface IProfileRepository {
  getProfile(token: string): Promise<Profile>;
  updateProfile(token: string, params: UpdateProfileParams): Promise<void>;
}
