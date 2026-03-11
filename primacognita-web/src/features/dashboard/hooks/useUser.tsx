import { useEffect, useState } from "react";

import { useSession } from "@/shared/hooks/useSession";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

import type { User } from "@/modules/user/domain/User";

type UseCurrentUserResult = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export const useCurrentUser = (): UseCurrentUserResult => {
  const { token, isAuthenticated } = useSession();
  const { userRepository } = useDependencies();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setUser(null);
      return;
    }

    const loadCurrentUser = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = await userRepository.getCurrentUser(token);
        setUser(currentUser);
      } catch (unknownError: unknown) {
        if (unknownError instanceof Error) {
          setError(unknownError);
          return;
        }

        setError(new Error("Unknown error while loading current user"));
      } finally {
        setIsLoading(false);
      }
    };

    void loadCurrentUser();
  }, [isAuthenticated, token, userRepository]);

  return {
    user,
    isLoading,
    error,
  };
};