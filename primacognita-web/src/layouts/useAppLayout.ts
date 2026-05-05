import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

export function useAppLayout() {
  const { user } = useCurrentUser();

  return {
    user: {
      name: user?.firstName ?? '',
      handle: user?.username ?? '',
      avatarUrl: user?.avatarUrl ?? null,
    },
  };
}