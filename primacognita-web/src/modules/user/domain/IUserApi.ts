import type { User } from './User';

export default interface IUserApi {
  getCurrentUser(token: string): Promise<User>;
}
