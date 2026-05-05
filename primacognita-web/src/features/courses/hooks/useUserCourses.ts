import { useCallback, useEffect, useState } from 'react';
import type { Course } from '@/modules/course/domain/Course';
import type { CourseCategoryId } from '@/modules/course/domain/CourseCategory';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

type UseUserCoursesResult = {
  courses: Course[];
  categoryNameById: Record<string, string>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const unique = (values: string[]) => Array.from(new Set(values));

export const useUserCourses = (userId: string | null, token: string | null): UseUserCoursesResult => {
  const { courseRepository: coursesRepository } = useDependencies();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categoryNameById, setCategoryNameById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!userId || !token) {
      setCourses([]);
      setCategoryNameById({});
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await coursesRepository.getUserCourses(userId, token);
      setCourses(data);

      const categoryIds = unique(
        data.map((c) => c.categoryId).filter((id): id is CourseCategoryId => Boolean(id && id.trim().length > 0)),
      );

      if (categoryIds.length === 0) {
        setCategoryNameById({});
        return;
      }

      const categories = await coursesRepository.getCourseCategories(token, categoryIds);

      const map: Record<string, string> = {};
      for (const cat of categories) {
        map[cat.id] = cat.name;
      }

      setCategoryNameById(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setCourses([]);
      setCategoryNameById({});
    } finally {
      setLoading(false);
    }
  }, [coursesRepository, token, userId]);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  return { courses, categoryNameById, loading, error, refetch: fetchCourses };
};
