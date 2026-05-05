import type { User } from '@/modules/user/domain/User';

export default interface UserSessionStore {
  save(user: User): void;
  get(): User | null;
  clear(): void;
}
