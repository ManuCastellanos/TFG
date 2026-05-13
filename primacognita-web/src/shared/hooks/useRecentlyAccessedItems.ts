import { useQuery } from '@tanstack/react-query';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from './queryKeys';
import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';

type UseRecentlyAccessedItemsResult = {
  items: RecentItem[];
  loading: boolean;
  error: string | null;
};

export function useRecentlyAccessedItems(token: string | null): UseRecentlyAccessedItemsResult {
  const { recentlyAccessedRepository } = useDependencies();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.recent.list(),
    queryFn: () => recentlyAccessedRepository.getRecentItems(token!),
    enabled: !!token,
    staleTime: 30 * 1000,
  });

  return {
    items: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}
