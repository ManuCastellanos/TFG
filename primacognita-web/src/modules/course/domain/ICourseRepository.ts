import type { Course } from "./Course";
import type { CourseCategory, CourseCategoryId } from "./CourseCategory";

export default interface ICourseRepository {
  getUserCourses(userId: string, token: string): Promise<Course[]>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
}
