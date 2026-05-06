import type IAuthSessionStore from '@/modules/auth/domain/IAuthSessionStore';
import type IUserSessionStore from '@/modules/user/domain/IUserSessionStore';

type LogoutDependencies = {
  authSessionStore: IAuthSessionStore;
  userSessionStore: IUserSessionStore;
};

export const logoutUser = (dependencies: LogoutDependencies): void => {
  dependencies.authSessionStore.clear();
  dependencies.userSessionStore.clear();
};
