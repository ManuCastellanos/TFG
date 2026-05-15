import type ICourseRepository from '../domain/ICourseRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { Course, CourseId } from '../domain/Course';
import type { CreateCourseInput, UpdateCourseInput } from '../domain/CreateCourseInput';
import type { CourseCategory, CourseCategoryId } from '../domain/CourseCategory';
import type { CourseSection } from '../domain/CourseSection';
import type { Participant } from '../domain/Participant';
import type { CreateSectionInput, UpdateSectionInput } from '../domain/CreateSectionInput';
import type { CreateResourceInput } from '../domain/CreateResourceInput';
import type { CreateUrlInput } from '../domain/CreateUrlInput';
import type { CreateForumInput } from '../domain/CreateForumInput';

export default class CourseRepository implements ICourseRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  createSection(token: string, input: CreateSectionInput): Promise<{ sectionId: number; sectionNum: number }> {
    return this.api.course.createSection(token, input);
  }

  updateSection(token: string, input: UpdateSectionInput): Promise<void> {
    return this.api.course.updateSection(token, input);
  }

  createResource(token: string, input: CreateResourceInput): Promise<{ cmid: number }> {
    return this.api.course.createResource(token, input);
  }

  createUrl(token: string, input: CreateUrlInput): Promise<{ cmid: number }> {
    return this.api.course.createUrl(token, input);
  }

  createForum(token: string, input: CreateForumInput): Promise<{ cmid: number; forumid: number }> {
    return this.api.course.createForum(token, input);
  }

  createCourseWithImage(token: string, input: CreateCourseInput, imageFile?: File): Promise<CourseId> {
    return this.api.course.createCourseWithImage(token, input, imageFile);
  }

  getUserCourses(userId: string, token: string): Promise<Course[]> {
    return this.api.course.getUserCourses(token, userId);
  }

  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]> {
    return this.api.course.getCourseCategories(token, ids);
  }

  getAllCategories(token: string): Promise<CourseCategory[]> {
    return this.api.course.getAllCategories(token);
  }

  createCourse(token: string, input: CreateCourseInput, imageItemId?: number): Promise<CourseId> {
    return this.api.course.createCourse(token, input, imageItemId);
  }

  updateCourse(token: string, input: UpdateCourseInput): Promise<void> {
    return this.api.course.updateCourse(token, input);
  }

  uploadCourseImage(token: string, file: File, userId: string): Promise<number> {
    return this.api.course.uploadCourseImage(token, file, userId);
  }

  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void> {
    return this.api.course.enrollTeacherInCourse(token, userId, courseId);
  }

  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]> {
    return this.api.course.getCourseContents(token, courseId);
  }

  getEnrolledUsers(token: string, courseId: CourseId): Promise<Participant[]> {
    return this.api.course.getEnrolledUsers(token, courseId);
  }

  markActivityComplete(token: string, cmId: number, completed: boolean): Promise<void> {
    return this.api.course.markActivityComplete(token, cmId, completed);
  }

  viewCourse(token: string, courseId: CourseId): Promise<void> {
    return this.api.course.viewCourse(token, courseId);
  }

  deleteModule(token: string, cmid: number): Promise<void> {
    return this.api.course.deleteModule(token, cmid);
  }

  deleteSection(token: string, courseId: number, sectionId: number): Promise<void> {
    return this.api.course.deleteSection(token, courseId, sectionId);
  }
}
