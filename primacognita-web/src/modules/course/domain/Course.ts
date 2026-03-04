export type CourseId = string;
export type CourseCategoryId = string;

export interface Course {
  id: CourseId;
  fullname: string;
  shortname: string;
  categoryId: CourseCategoryId | null;
  imageUrl: string | null;
  summary: string | null;
}