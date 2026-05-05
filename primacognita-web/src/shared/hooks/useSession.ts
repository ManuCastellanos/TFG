import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseSessionResult = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
};

export const useSession = (): UseSessionResult => {
  const { authSessionStore, userSessionStore } = useDependencies();
  const auth = authSessionStore.get();
  const user = userSessionStore.get();

  return {
    token: auth?.token ?? null,
    userId: user?.id ?? null,
    isAuthenticated: !!auth?.token,
  };
};