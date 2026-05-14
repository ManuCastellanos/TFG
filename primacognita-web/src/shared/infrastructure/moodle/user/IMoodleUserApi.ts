import type { User } from '@/modules/user/domain/User';

export default interface IMoodleUserApi {
  getCurrentUser(token: string): Promise<User>;
}
