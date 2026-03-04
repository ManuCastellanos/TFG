import { useCallback, useState } from "react";

import SessionStorage from "@/modules/login/infrastructure/AuthStorage";
import { Constants } from "@/shared/constants/Constants";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseLoginResult = {
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  clearError: () => void;
};

export const useLogin = (): UseLoginResult => {
  const { authRepository } = useDependencies();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const auth = await authRepository.login(username, password);
        SessionStorage.set(auth);
      } catch {
        setError(Constants.INVALID_ACCESS_MSG);
      } finally {
        setIsLoading(false);
      }
    },
    [authRepository],
  );

  return { error, isLoading, login, clearError };
};