import type IUserRepository from '../domain/IUserRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { User } from '../domain/User';

export default class UserRepository implements IUserRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  getCurrentUser(token: string): Promise<User> {
    return this.api.user.getCurrentUser(token);
  }
}
