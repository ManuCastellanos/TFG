import { useEffect, useState } from "react";

import type { Course } from "@/modules/course/domain/Course";
import type { Auth } from "@/modules/login/domain/Auth";
import CourseRepository from "@/modules/course/infrastructure/CourseRepository";

type UseUserCoursesResult = {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useUserCourse = (userId: string | null, token: string | null): UseUserCoursesResult => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repo = new CourseRepository();

  const fetchCourses = async () => {
    if (!userId || !token) {
      setCourses([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await repo.getUserCourses(userId, token);
      setCourses(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  return { courses, loading, error, refetch: fetchCourses };
};