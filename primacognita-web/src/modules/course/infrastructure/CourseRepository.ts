import type ICourseRepository from '../domain/ICourseRepository';
import type ICourseApi from '../domain/ICourseApi';
import type { Course, CourseId } from '../domain/Course';
import type { CreateCourseInput, UpdateCourseInput } from '../domain/CreateCourseInput';
import type { CourseCategory, CourseCategoryId } from '../domain/CourseCategory';
import type { CourseSection } from '../domain/CourseSection';
import type { Participant } from '../domain/Participant';

export default class CourseRepository implements ICourseRepository {
  constructor(private readonly api: ICourseApi) {}

  createCourseWithImage(token: string, input: CreateCourseInput, imageFile?: File): Promise<CourseId> {
    return this.api.createCourseWithImage(token, input, imageFile);
  }

  getUserCourses(userId: string, token: string): Promise<Course[]> {
    return this.api.getUserCourses(token, userId);
  }

  getCourseCategories(token: string, ids: CourseCategoryId[]): Promise<CourseCategory[]> {
    return this.api.getCourseCategories(token, ids);
  }

  getAllCategories(token: string): Promise<CourseCategory[]> {
    return this.api.getAllCategories(token);
  }

  createCourse(token: string, input: CreateCourseInput, imageItemId?: number): Promise<CourseId> {
    return this.api.createCourse(token, input, imageItemId);
  }

  updateCourse(token: string, input: UpdateCourseInput): Promise<void> {
    return this.api.updateCourse(token, input);
  }

  uploadCourseImage(token: string, file: File, userId: string): Promise<number> {
    return this.api.uploadCourseImage(token, file, userId);
  }

  enrollTeacherInCourse(token: string, userId: string, courseId: CourseId): Promise<void> {
    return this.api.enrollTeacherInCourse(token, userId, courseId);
  }

  getCourseContents(token: string, courseId: CourseId): Promise<CourseSection[]> {
    return this.api.getCourseContents(token, courseId);
  }

  getEnrolledUsers(token: string, courseId: CourseId): Promise<Participant[]> {
    return this.api.getEnrolledUsers(token, courseId);
  }

  markActivityComplete(token: string, cmId: number, completed: boolean): Promise<void> {
    return this.api.markActivityComplete(token, cmId, completed);
  }

  viewCourse(token: string, courseId: CourseId): Promise<void> {
    return this.api.viewCourse(token, courseId);
  }
}
