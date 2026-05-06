import type { Course, CourseId } from './Course';
import type { CreateCourseInput, UpdateCourseInput } from './CreateCourseInput';
import type { CourseCategory, CourseCategoryId } from './CourseCategory';
import type { CourseSection } from './CourseSection';
import type { Participant } from './Participant';

export default interface ICourseRepository {
  getUserCourses(userId: string, token: string): Promise<Course[]>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
  getAllCategories(token: string): Promise<CourseCategory[]>;
  createCourse(token: string, input: CreateCourseInput, imageItemId?: number): Promise<CourseId>;
  updateCourse(token: string, input: UpdateCourseInput): Promise<void>;
  uploadCourseImage(token: string, file: File, userId: string): Promise<number>;
  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void>;
  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]>;
  getEnrolledUsers(token: string, courseId: CourseId): Promise<Participant[]>;
}
