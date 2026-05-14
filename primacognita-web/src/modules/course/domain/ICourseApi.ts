import type { Course, CourseId } from './Course';
import type { CourseCategory, CourseCategoryId } from './CourseCategory';
import type { CourseSection } from './CourseSection';
import type { Participant } from './Participant';
import type { CreateCourseInput, UpdateCourseInput } from './CreateCourseInput';

export default interface ICourseApi {
  getUserCourses(token: string, userId: string): Promise<Course[]>;
  createCourseWithImage(token: string, input: CreateCourseInput, imageFile?: File): Promise<CourseId>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
  getAllCategories(token: string): Promise<CourseCategory[]>;
  createCourse(token: string, input: CreateCourseInput, imageItemId?: number): Promise<CourseId>;
  updateCourse(token: string, input: UpdateCourseInput): Promise<void>;
  uploadCourseImage(token: string, file: File, userId: string): Promise<number>;
  getEnrolledUsers(token: string, courseId: CourseId): Promise<Participant[]>;
  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void>;
  viewCourse(token: string, courseId: CourseId): Promise<void>;
  markActivityComplete(token: string, cmId: number, completed: boolean): Promise<void>;
  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]>;
}
