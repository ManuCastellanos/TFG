import { useCallback, useEffect, useState } from "react";
import type { RecentItem } from "@/modules/recentlyAccessed/domain/RecentItem";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseRecentlyAccessedItemsResult = {
  items: RecentItem[];
  loading: boolean;
  error: string | null;
};

export const useRecentlyAccessedItems = (
  token: string | null,
): UseRecentlyAccessedItemsResult => {
  const { recentlyAccessedRepository } = useDependencies();

  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await recentlyAccessedRepository.getRecentItems(token);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [recentlyAccessedRepository, token]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return { items, loading, error };
};
