import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Course, CourseId } from '@/modules/course/domain/Course';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { isExerciseModule } from '@/modules/course/domain/CourseSection';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { queryKeys } from '@/shared/hooks/queryKeys';

type UseCoursePageDataResult = {
  course: Course | null;
  sections: CourseSection[];
  exercises: CourseModule[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateModuleCompletion: (cmid: number, completed: boolean) => void;
};

export const useCoursePageData = (
  courseId: CourseId | null,
  userId: string | null,
  token: string | null,
): UseCoursePageDataResult => {
  const { courseRepository } = useDependencies();

  const queryKey = queryKeys.courses.contents(courseId ?? '');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const [userCourses, contents] = await Promise.all([
        courseRepository.getUserCourses(userId!, token!),
        courseRepository.getCourseContents(token!, courseId!),
      ]);
      const matched = userCourses.find((c) => c.id === courseId) ?? null;
      return { course: matched, sections: contents };
    },
    enabled: !!courseId && !!userId && !!token,
    staleTime: 5 * 60 * 1000,
  });

  const [localSections, setLocalSections] = useState<CourseSection[]>([]);

  useEffect(() => {
    if (data) setLocalSections(data.sections);
  }, [data]);

  const sections = data ? localSections : [];

  const exercises = useMemo<CourseModule[]>(
    () => sections.flatMap((s) => s.modules.filter(isExerciseModule)),
    [sections],
  );

  const updateModuleCompletion = (cmid: number, completed: boolean) => {
    setLocalSections((prev) =>
      prev.map((section) => ({
        ...section,
        modules: section.modules.map((m) =>
          m.cmid === cmid && m.completion
            ? { ...m, completion: { ...m.completion, state: (completed ? 1 : 0) as 0 | 1 | 2 | 3 } }
            : m,
        ),
      })),
    );
  };

  return {
    course: data?.course ?? null,
    sections,
    exercises,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
    updateModuleCompletion,
  };
};
