export type CourseResponse = {
  id: number;
  fullname: string;
  shortname: string;
  category?: number;
  courseimage?: string;
  progress?: number;
  summary?: string;
  visible?: number;
  hidden?: number;
  completed?: number;
};

export type CreateCourseResponse = {
  id: number;
  shortname: string;
};

export type CreateCourseApiResponse = {
  courses: CreateCourseResponse[];
  warnings: unknown[];
};
