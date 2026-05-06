import type IAuthRepository from '@/modules/auth/domain/IAuthRepository';
import type IAuthSessionStore from '@/modules/auth/domain/IAuthSessionStore';
import type IUserRepository from '@/modules/user/domain/IUserRepository';
import type IUserSessionStore from '@/modules/user/domain/IUserSessionStore';
import type { LoginCredentials } from '../login/types/login.types';

type LoginDependencies = {
  authRepository: IAuthRepository;
  authSessionStore: IAuthSessionStore;
  userRepository: IUserRepository;
  userSessionStore: IUserSessionStore;
};

export const loginUser = async (credentials: LoginCredentials, dependencies: LoginDependencies): Promise<void> => {
  const auth = await dependencies.authRepository.login(credentials.username, credentials.password);
  dependencies.authSessionStore.save(auth);

  const user = await dependencies.userRepository.getCurrentUser(auth.token);
  dependencies.userSessionStore.save(user);
};
