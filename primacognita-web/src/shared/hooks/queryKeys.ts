export const queryKeys = {
  users: {
    all:     ['users'] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },
  courses: {
    all:       ['courses'] as const,
    list:      (userId: string) => [...queryKeys.courses.all, 'list', userId] as const,
    detail:    (id: string) => [...queryKeys.courses.all, 'detail', id] as const,
    contents:  (id: string) => [...queryKeys.courses.all, 'contents', id] as const,
  },
  calendar: {
    all:     ['calendar'] as const,
    month:   (year: number, month: number) => [...queryKeys.calendar.all, year, month] as const,
  },
  recent: {
    all:     ['recentlyAccessed'] as const,
    list:    () => [...queryKeys.recent.all, 'list'] as const,
  },
  assignments: {
    all:           ['assignments'] as const,
    upcoming:      (courseId: string) => [...queryKeys.assignments.all, 'upcoming', courseId] as const,
    meta:          (courseId: number) => [...queryKeys.assignments.all, 'meta', courseId] as const,
    submissions:   (assignIds: number[]) => [...queryKeys.assignments.all, 'submissions', ...assignIds] as const,
    grades:        (assignIds: number[]) => [...queryKeys.assignments.all, 'grades', ...assignIds] as const,
  },
  exercises: {
    all:     ['exercises'] as const,
    enriched:(courseId: string, cmidSignature: string) =>
      [...queryKeys.exercises.all, courseId, cmidSignature] as const,
  },
};
