import type UserSessionStore from '@/modules/user/domain/IUserSessionStore';
import type { User } from '@/modules/user/domain/User';

export default class UserStorage implements UserSessionStore {
  save(user: User): void {
    localStorage.setItem('user:v1', JSON.stringify(user));
  }

  get(): User | null {
    const user = localStorage.getItem('user:v1');
    return user ? JSON.parse(user) : null;
  }

  clear(): void {
    localStorage.removeItem('user:v1');
  }
  
}