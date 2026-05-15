import type { Course, CourseId } from './Course';
import type { CreateCourseInput, UpdateCourseInput } from './CreateCourseInput';
import type { CourseCategory, CourseCategoryId } from './CourseCategory';
import type { CourseSection } from './CourseSection';
import type { Participant } from './Participant';
import type { CreateSectionInput, UpdateSectionInput } from './CreateSectionInput';
import type { CreateResourceInput } from './CreateResourceInput';
import type { CreateUrlInput } from './CreateUrlInput';
import type { CreateForumInput } from './CreateForumInput';

export default interface ICourseRepository {
  createSection(token: string, input: CreateSectionInput): Promise<{ sectionId: number; sectionNum: number }>;
  updateSection(token: string, input: UpdateSectionInput): Promise<void>;
  createResource(token: string, input: CreateResourceInput): Promise<{ cmid: number }>;
  createUrl(token: string, input: CreateUrlInput): Promise<{ cmid: number }>;
  createForum(token: string, input: CreateForumInput): Promise<{ cmid: number; forumid: number }>;
  getUserCourses(userId: string, token: string): Promise<Course[]>;
  createCourseWithImage(token: string, input: CreateCourseInput, imageFile?: File): Promise<CourseId>;
  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]>;
  getAllCategories(token: string): Promise<CourseCategory[]>;
  createCourse(token: string, input: CreateCourseInput, imageItemId?: number): Promise<CourseId>;
  updateCourse(token: string, input: UpdateCourseInput): Promise<void>;
  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void>;
  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]>;
  getEnrolledUsers(token: string, courseId: CourseId): Promise<Participant[]>;
  markActivityComplete(token: string, cmId: number, completed: boolean): Promise<void>;
  viewCourse(token: string, courseId: CourseId): Promise<void>;
  deleteModule(token: string, cmid: number): Promise<void>;
  deleteSection(token: string, courseId: number, sectionId: number): Promise<void>;
}
