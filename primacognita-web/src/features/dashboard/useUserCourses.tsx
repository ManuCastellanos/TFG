import { useEffect, useMemo, useState } from "react";

import type { Course } from "@/modules/course/domain/Course";
import type { CourseCategoryId } from "@/modules/course/domain/CourseCategory";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";

type UseUserCoursesResult = {
  courses: Course[];
  categoryNameById: Record<string, string>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const unique = (values: string[]) => Array.from(new Set(values));

export const useUserCourses = (
  userId: string | null,
  token: string | null
): UseUserCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categoryNameById, setCategoryNameById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repo = useMemo(() => new CourseRepository(), []);

  const fetchCourses = async () => {
    if (!userId || !token) {
      setCourses([]);
      setCategoryNameById({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1) Cursos
      const data = await repo.getUserCourses(userId, token);
      setCourses(data);

      // 2) Categorías (batch)
      const categoryIds = unique(
        data
          .map((c) => c.categoryId)
          .filter((id): id is CourseCategoryId => Boolean(id && id.trim().length > 0))
      );

      if (categoryIds.length === 0) {
        setCategoryNameById({});
        return;
      }

      const categories = await repo.getCourseCategories(token, categoryIds);

      const map: Record<string, string> = {};
      categories.forEach((cat) => {
        map[cat.id] = cat.name;
      });

      setCategoryNameById(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setCourses([]);
      setCategoryNameById({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  return { courses, categoryNameById, loading, error, refetch: fetchCourses };
};