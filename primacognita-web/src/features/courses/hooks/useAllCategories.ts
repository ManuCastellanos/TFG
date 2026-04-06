import { useCallback, useEffect, useState } from "react";

import type { CourseCategory } from "@/modules/course/domain/CourseCategory";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseAllCategoriesResult = {
  categories: CourseCategory[];
  loading: boolean;
  error: string | null;
};

export const useAllCategories = (token: string | null): UseAllCategoriesResult => {
  const { courseRepository } = useDependencies();

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!token) {
      setCategories([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await courseRepository.getAllCategories(token);
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [courseRepository, token]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error };
};
