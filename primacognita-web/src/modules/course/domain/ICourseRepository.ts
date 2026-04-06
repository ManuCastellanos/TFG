import type { Course, CourseId } from "./Course";
import type { CourseCategory, CourseCategoryId } from "./CourseCategory";

export default interface ICourseRepository {
  getUserCourses(userId: string, token: string): Promise<Course[]>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
  getAllCategories(token: string): Promise<CourseCategory[]>;
  createCourse(token: string, input: Course): Promise<CourseId>;
  updateCourse(token: string, input: Course): Promise<void>;
  uploadCourseImage(token: string, file: File): Promise<number>;
}
