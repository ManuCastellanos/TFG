import type IAssignmentRepository from '../domain/IAssignmentRepository';
import type IAssignmentApi from '../domain/IAssignmentApi';
import type { Assignment } from '../domain/Assignment';
import type { AssignmentMeta } from '../domain/AssignmentMeta';
import type { GradeEntry } from '../domain/GradeEntry';
import type { SubmissionEntry } from '../domain/SubmissionEntry';
import type { UpcomingAssignment } from '../domain/UpcomingAssignment';

export default class AssignmentRepository implements IAssignmentRepository {
  constructor(private readonly api: IAssignmentApi) {}

  getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null> {
    return this.api.getAssignment(token, courseId, cmid, userId);
  }

  getDraftItemId(token: string): Promise<number> {
    return this.api.getDraftItemId(token);
  }

  uploadFileToDraft(token: string, file: File, draftItemId: number): Promise<void> {
    return this.api.uploadFileToDraft(token, file, draftItemId);
  }

  uploadDraftFile(token: string, file: File): Promise<number> {
    return this.api.uploadDraftFile(token, file);
  }

  saveSubmission(token: string, assignId: number, draftItemId: number, note?: string): Promise<void> {
    return this.api.saveSubmission(token, assignId, draftItemId, note);
  }

  submitForGrading(token: string, assignId: number): Promise<void> {
    return this.api.submitForGrading(token, assignId);
  }

  getAssignmentsForCourse(token: string, courseId: number): Promise<AssignmentMeta[]> {
    return this.api.getAssignmentsForCourse(token, courseId);
  }

  getSubmissionsForAssignments(token: string, assignIds: number[]): Promise<Record<number, SubmissionEntry[]>> {
    return this.api.getSubmissionsForAssignments(token, assignIds);
  }

  getGradesForAssignments(token: string, assignIds: number[]): Promise<Record<number, GradeEntry[]>> {
    return this.api.getGradesForAssignments(token, assignIds);
  }

  saveGrade(token: string, assignId: number, userId: number, grade: number, feedback: string): Promise<void> {
    return this.api.saveGrade(token, assignId, userId, grade, feedback);
  }

  getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]> {
    return this.api.getUpcomingAssignments(token, courseId, userId);
  }
}
