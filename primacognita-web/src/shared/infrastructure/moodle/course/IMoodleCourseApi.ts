import type { Course, CourseId } from '@/modules/course/domain/Course';
import type { CreateCourseInput, UpdateCourseInput } from '@/modules/course/domain/CreateCourseInput';
import type { CourseCategory, CourseCategoryId } from '@/modules/course/domain/CourseCategory';
import type { CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { CreateSectionInput, UpdateSectionInput } from '@/modules/course/domain/CreateSectionInput';
import type { CreateResourceInput } from '@/modules/course/domain/CreateResourceInput';
import type { CreateUrlInput } from '@/modules/course/domain/CreateUrlInput';

export default interface IMoodleCourseApi {
  createSection(token: string, input: CreateSectionInput): Promise<{ sectionId: number; sectionNum: number }>;
  updateSection(token: string, input: UpdateSectionInput): Promise<void>;
  createResource(token: string, input: CreateResourceInput): Promise<{ cmid: number }>;
  createUrl(token: string, input: CreateUrlInput): Promise<{ cmid: number }>;
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
