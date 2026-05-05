import { useCallback, useEffect, useState } from 'react';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';

type UseRecentlyAccessedItemsResult = {
  items: RecentItem[];
  loading: boolean;
  error: string | null;
};

export function useRecentlyAccessedItems(token: string | null): UseRecentlyAccessedItemsResult {
  const { recentlyAccessedRepository } = useDependencies();

  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setItems(await recentlyAccessedRepository.getRecentItems(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [recentlyAccessedRepository, token]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { items, loading, error };
}
