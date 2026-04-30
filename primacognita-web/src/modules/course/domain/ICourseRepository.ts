import type { Course, CourseId } from "./Course";
import type { CourseCategory, CourseCategoryId } from "./CourseCategory";
import type { CourseSection } from "./CourseSection";

export default interface ICourseRepository {
  getUserCourses(userId: string, token: string): Promise<Course[]>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
  getAllCategories(token: string): Promise<CourseCategory[]>;
  createCourse(token: string, input: Course, imageItemId?: number): Promise<CourseId>;
  updateCourse(token: string, input: Course): Promise<void>;
  uploadCourseImage(token: string, file: File, userId: string): Promise<number>;
  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void>;
  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]>;
}
