import { useEffect, useState } from 'react';
import { useSession } from './useSession';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { User } from '@/modules/user/domain/User';

type UseCurrentUserResult = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

export function useCurrentUser(): UseCurrentUserResult {
  const { token, isAuthenticated } = useSession();
  const { userRepository, userSessionStore } = useDependencies();

  const [user, setUser] = useState<User | null>(() => userSessionStore.get());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setUser(null);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUser = await userRepository.getCurrentUser(token);
        userSessionStore.save(fetchedUser);
        setUser(fetchedUser);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Error al cargar el usuario'));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [isAuthenticated, token, userRepository, userSessionStore]);

  return { user, isLoading, error };
}
