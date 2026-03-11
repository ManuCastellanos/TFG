import type { User } from "./User";

export default interface IUserRepository {
  getCurrentUser(token: string): Promise<User>;
}