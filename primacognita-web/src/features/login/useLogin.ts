import { useCallback, useMemo, useState } from "react";
import AuthRepository from "../../modules/login/infrastructure/AuthRepository";
import TokenStorage from "../../modules/login/infrastructure/AuthStorage";
import { Constants } from "../../shared/constants/Constants";

type UseLoginResult = {
  error: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  clearError: () => void;
};

export const useLogin = (): UseLoginResult => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const repository = useMemo(() => new AuthRepository(), []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        const token = await repository.login(username, password);
        TokenStorage.set(token);
      } catch {
        setError(Constants.INVALID_ACCESS_MSG);
        throw new Error(Constants.INVALID_ACCESS_MSG);
      } finally {
        setIsLoading(false);
      }
    },
    [repository],
  );

  return { error, isLoading, login, clearError };
};
