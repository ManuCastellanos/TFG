import { useCallback, useState } from 'react';
import { Constants } from '@/shared/constants/Constants';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { loginUser } from '@/features/session/loginUser';
import type { LoginCredentials } from '../types/login.types';

type UseLoginResult = {
  error: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
};

export const useLogin = (): UseLoginResult => {
  const dependencies = useDependencies();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        await loginUser(credentials, dependencies);
        return true;
      } catch {
        setError(Constants.INVALID_ACCESS_MSG);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies],
  );

  return { error, isLoading, login };
};
