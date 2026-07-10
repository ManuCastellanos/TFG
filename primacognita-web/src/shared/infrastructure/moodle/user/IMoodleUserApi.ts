import type { User } from '@/modules/user/domain/User';

export type CachedRole = { roleId: number | null; roleName: string | null };

export type UserSearchResult = { id: number; fullName: string; avatarUrl: string | null };

export default interface IMoodleUserApi {
  getCurrentUser(token: string, cachedRole?: CachedRole): Promise<User>;
  searchUsers(token: string, search: string): Promise<UserSearchResult[]>;
}
