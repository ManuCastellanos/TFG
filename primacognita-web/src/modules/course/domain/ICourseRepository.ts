import type { Course } from "./Course";

export default interface ICourseRepository {
  getUserCourses(userId: string, token: string): Promise<Course[]>;
}
