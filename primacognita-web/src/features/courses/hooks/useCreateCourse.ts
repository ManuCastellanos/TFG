import { useCallback, useState } from "react";

import type { Course, CourseId } from "@/modules/course/domain/Course";
import { useDependencies } from "@/shared/providers/DependenciesProvider";

type UseCreateCourseResult = {
  createCourse: (input: Course, imageFile?: File) => Promise<CourseId>;
  loading: boolean;
  error: string | null;
};

export const useCreateCourse = (
  token: string | null,
  userId: string | null,
): UseCreateCourseResult => {
  const { courseRepository } = useDependencies();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(
    async (input: Course, imageFile?: File): Promise<CourseId> => {
      if (!token || !userId) throw new Error("No token");

      setLoading(true);
      setError(null);

      try {
        let imageItemId: number | undefined;
        if (imageFile) {

          imageItemId = await courseRepository.uploadCourseImage(token, imageFile, userId);
        }

        const courseId = await courseRepository.createCourse(token, input, imageItemId);
        await courseRepository.enrollTeacherInCourse(token, userId, courseId);
        return courseId;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [courseRepository, token, userId],
  );

  return { createCourse, loading, error };
};
