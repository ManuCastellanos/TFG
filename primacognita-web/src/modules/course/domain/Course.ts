import type { CourseCategoryId } from './CourseCategory';

export type CourseId = string;

export interface Course {
  id: CourseId;
  fullname: string;
  shortname: string;
  categoryId: CourseCategoryId | null;
  imageUrl: string | null;
  summary: string | null;
  progress: number | null;
  completed: boolean;
}
