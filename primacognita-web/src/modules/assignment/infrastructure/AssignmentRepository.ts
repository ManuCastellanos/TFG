import type IAssignmentRepository from '../domain/IAssignmentRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { Assignment } from '../domain/Assignment';
import type { AssignmentMeta } from '../domain/AssignmentMeta';
import type { GradeEntry } from '../domain/GradeEntry';
import type { SubmissionEntry } from '../domain/SubmissionEntry';
import type { UpcomingAssignment } from '../domain/UpcomingAssignment';
import type { CreateAssignmentInput, UpdateAssignmentInput } from '../domain/CreateAssignmentInput';

export default class AssignmentRepository implements IAssignmentRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  createAssignment(token: string, input: CreateAssignmentInput): Promise<{ cmid: number; assignmentId: number }> {
    return this.api.assignment.createAssignment(token, input);
  }

  updateAssignment(token: string, input: UpdateAssignmentInput): Promise<void> {
    return this.api.assignment.updateAssignment(token, input);
  }

  getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null> {
    return this.api.assignment.getAssignment(token, courseId, cmid, userId);
  }

  getDraftItemId(token: string): Promise<number> {
    return this.api.assignment.getDraftItemId(token);
  }

  uploadFileToDraft(token: string, file: File, draftItemId: number): Promise<void> {
    return this.api.assignment.uploadFileToDraft(token, file, draftItemId);
  }

  uploadDraftFile(token: string, file: File): Promise<number> {
    return this.api.assignment.uploadDraftFile(token, file);
  }

  saveSubmission(token: string, assignId: number, draftItemId: number, note?: string): Promise<void> {
    return this.api.assignment.saveSubmission(token, assignId, draftItemId, note);
  }

  submitForGrading(token: string, assignId: number): Promise<void> {
    return this.api.assignment.submitForGrading(token, assignId);
  }

  getAssignmentsForCourse(token: string, courseId: number): Promise<AssignmentMeta[]> {
    return this.api.assignment.getAssignmentsForCourse(token, courseId);
  }

  getSubmissionsForAssignments(token: string, assignIds: number[]): Promise<Record<number, SubmissionEntry[]>> {
    return this.api.assignment.getSubmissionsForAssignments(token, assignIds);
  }

  getGradesForAssignments(token: string, assignIds: number[]): Promise<Record<number, GradeEntry[]>> {
    return this.api.assignment.getGradesForAssignments(token, assignIds);
  }

  saveGrade(token: string, assignId: number, userId: number, grade: number, feedback: string): Promise<void> {
    return this.api.assignment.saveGrade(token, assignId, userId, grade, feedback);
  }

  getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]> {
    return this.api.assignment.getUpcomingAssignments(token, courseId, userId);
  }
}
