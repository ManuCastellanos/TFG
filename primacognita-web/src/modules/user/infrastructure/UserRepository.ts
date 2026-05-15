import type IUserRepository from '../domain/IUserRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { User } from '../domain/User';
import type { CachedRole } from '@/shared/infrastructure/moodle/user/IMoodleUserApi';

export default class UserRepository implements IUserRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getCurrentUser(token: string, cachedRole?: CachedRole): Promise<User> {
    return this.api.user.getCurrentUser(token, cachedRole);
  }
}
