import { useCallback, useState } from 'react';

import { Constants } from '@/shared/constants/Constants';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

type UseLoginResult = {
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  clearError: () => void;
};

export const useLogin = (): UseLoginResult => {
  const { authRepository, authSessionStore } = useDependencies();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        const auth = await authRepository.login(username, password);
        authSessionStore.save(auth);
        return true;
      } catch {
        setError(Constants.INVALID_ACCESS_MSG);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [authRepository, authSessionStore],
  );

  return { error, isLoading, login, clearError };
};
