import { useQuery } from '@tanstack/react-query';
import type { Course } from '@/modules/course/domain/Course';
import type { CourseCategoryId } from '@/modules/course/domain/CourseCategory';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from './queryKeys';

type UseUserCoursesResult = {
  courses: Course[];
  categoryNameById: Record<string, string>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const unique = (values: string[]) => Array.from(new Set(values));

export const useUserCourses = (userId: string | null, token: string | null): UseUserCoursesResult => {
  const { courseRepository: coursesRepository } = useDependencies();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.courses.list(userId ?? ''),
    queryFn: async () => {
      const courses = await coursesRepository.getUserCourses(userId!, token!);

      const categoryIds = unique(
        courses.flatMap((c) => {
          const id = c.categoryId;
          return id && id.trim().length > 0 ? [id as CourseCategoryId] : [];
        }),
      );

      const categoryNameById: Record<string, string> = {};
      if (categoryIds.length > 0) {
        const categories = await coursesRepository.getCourseCategories(token!, categoryIds);
        for (const cat of categories) {
          categoryNameById[cat.id] = cat.name;
        }
      }

      return { courses, categoryNameById };
    },
    enabled: !!userId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  return {
    courses: data?.courses ?? [],
    categoryNameById: data?.categoryNameById ?? {},
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
