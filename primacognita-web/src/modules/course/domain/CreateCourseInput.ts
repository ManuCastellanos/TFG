import type { CourseId } from './Course';
import type { CourseCategoryId } from './CourseCategory';

export type CreateCourseInput = {
  fullname: string;
  shortname: string;
  categoryId: CourseCategoryId | null;
  summary?: string | null;
  visible?: 0 | 1;
  startdate?: number;
  enddate?: number;
  idnumber?: number;
};

export type UpdateCourseInput = CreateCourseInput & { id: CourseId };
