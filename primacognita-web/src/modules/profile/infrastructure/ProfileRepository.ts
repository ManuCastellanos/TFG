import type IProfileRepository from '../domain/IProfileRepository';
import type { Profile, UpdateProfileParams, UpdateAccountParams, ChangePasswordParams } from '../domain/Profile';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';

export default class ProfileRepository implements IProfileRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getProfile(token: string, userId: string): Promise<Profile> {
    return this.api.profile.getProfile(token, userId);
  }

  updateProfile(token: string, params: UpdateProfileParams, userId: string): Promise<void> {
    return this.api.profile.updateProfile(token, params, userId);
  }

  updateAccount(token: string, params: UpdateAccountParams): Promise<void> {
    return this.api.profile.updateAccount(token, params);
  }

  changePassword(token: string, params: ChangePasswordParams): Promise<void> {
    return this.api.profile.changePassword(token, params);
  }
}
