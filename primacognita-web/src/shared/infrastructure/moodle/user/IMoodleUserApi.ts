import type { User } from '@/modules/user/domain/User';

export type CachedRole = { roleId: number | null; roleName: string | null };

export default interface IMoodleUserApi {
  getCurrentUser(token: string, cachedRole?: CachedRole): Promise<User>;
}
