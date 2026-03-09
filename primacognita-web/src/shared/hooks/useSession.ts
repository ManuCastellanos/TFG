import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseSessionResult = {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
};

export const useSession = (): UseSessionResult => {
  const { authSessionStore } = useDependencies();
  const session = authSessionStore.get();

  return {
    token: session?.token ?? null,
    userId: session?.userId ?? null,
    isAuthenticated: !!session?.token,
  };
};