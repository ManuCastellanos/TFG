import type IUserRepository from '../domain/IUserRepository';
import type IUserApi from '../domain/IUserApi';
import type { User } from '../domain/User';

export default class UserRepository implements IUserRepository {
  constructor(private readonly api: IUserApi) {}

  getCurrentUser(token: string): Promise<User> {
    return this.api.getCurrentUser(token);
  }
}
