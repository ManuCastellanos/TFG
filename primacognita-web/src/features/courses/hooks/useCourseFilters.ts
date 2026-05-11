import { useMemo, useState } from 'react';
import type { Course } from '@/modules/course/domain/Course';

export function useCourseFilters(courses: Course[]) {
  const [filter, setFilter] = useState<'todos' | 'pendientes'>('todos');
  const [search, setSearch] = useState('');

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) => {
        const matchesSearch =
          !search ||
          c.fullname.toLowerCase().includes(search.toLowerCase()) ||
          c.shortname.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'todos' || (filter === 'pendientes' && !c.completed);
        return matchesSearch && matchesFilter;
      }),
    [courses, filter, search],
  );

  const pendingCount = useMemo(
    () => courses.filter((c) => !c.completed).length,
    [courses],
  );

  return { filter, search, setFilter, setSearch, filteredCourses, pendingCount };
}
