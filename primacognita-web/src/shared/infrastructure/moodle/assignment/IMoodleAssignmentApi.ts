import type { Assignment } from '@/modules/assignment/domain/Assignment';
import type { AssignmentMeta } from '@/modules/assignment/domain/AssignmentMeta';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import type { SubmissionEntry } from '@/modules/assignment/domain/SubmissionEntry';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import type { CreateAssignmentInput, UpdateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';

export default interface IMoodleAssignmentApi {
  getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null>;
  getDraftItemId(token: string): Promise<number>;
  uploadFileToDraft(token: string, file: File, draftItemId: number): Promise<void>;
  uploadDraftFile(token: string, file: File): Promise<number>;
  saveSubmission(token: string, assignId: number, draftItemId: number, note?: string): Promise<void>;
  submitForGrading(token: string, assignId: number): Promise<void>;
  getAssignmentsForCourse(token: string, courseId: number): Promise<AssignmentMeta[]>;
  getSubmissionsForAssignments(token: string, assignIds: number[]): Promise<Record<number, SubmissionEntry[]>>;
  getGradesForAssignments(token: string, assignIds: number[]): Promise<Record<number, GradeEntry[]>>;
  saveGrade(token: string, assignId: number, userId: number, grade: number, feedback: string): Promise<void>;
  getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]>;
  createAssignment(token: string, input: CreateAssignmentInput): Promise<{ cmid: number; assignmentId: number }>;
  updateAssignment(token: string, input: UpdateAssignmentInput): Promise<void>;
}
