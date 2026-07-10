import type { User } from './User';
import type { CachedRole, UserSearchResult } from '@/shared/infrastructure/moodle/user/IMoodleUserApi';

export default interface IUserRepository {
  getCurrentUser(token: string, cachedRole?: CachedRole): Promise<User>;
  searchUsers(token: string, search: string): Promise<UserSearchResult[]>;
}
