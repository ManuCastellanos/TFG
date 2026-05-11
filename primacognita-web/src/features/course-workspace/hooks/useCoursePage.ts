import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Course, CourseId } from '@/modules/course/domain/Course';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { isExerciseModule } from '@/modules/course/domain/CourseSection';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

type UseCoursePageDataResult = {
  course: Course | null;
  sections: CourseSection[];
  exercises: CourseModule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateModuleCompletion: (cmid: number, completed: boolean) => void;
};

export const useCoursePageData = (
  courseId: CourseId | null,
  userId: string | null,
  token: string | null,
): UseCoursePageDataResult => {
  const { courseRepository } = useDependencies();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!courseId || !userId || !token) {
      setCourse(null);
      setSections([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userCourses, contents] = await Promise.all([
        courseRepository.getUserCourses(userId, token),
        courseRepository.getCourseContents(token, courseId),
      ]);

      const matched = userCourses.find((c) => c.id === courseId) ?? null;
      setCourse(matched);
      setSections(contents);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setCourse(null);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [courseRepository, courseId, userId, token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const exercises = useMemo<CourseModule[]>(
    () => sections.flatMap((s) => s.modules.filter(isExerciseModule)),
    [sections],
  );

  const updateModuleCompletion = useCallback((cmid: number, completed: boolean) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        modules: section.modules.map((m) =>
          m.cmid === cmid && m.completion
            ? { ...m, completion: { ...m.completion, state: (completed ? 1 : 0) as 0 | 1 | 2 | 3 } }
            : m,
        ),
      })),
    );
  }, []);

  return { course, sections, exercises, loading, error, refetch: fetchData, updateModuleCompletion };
};
