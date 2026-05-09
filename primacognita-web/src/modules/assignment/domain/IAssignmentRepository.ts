import type { Assignment } from './Assignment';
import type { UpcomingAssignment } from './UpcomingAssignment';

export default interface IAssignmentRepository {
  getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null>;
  getDraftItemId(token: string): Promise<number>;
  uploadFileToDraft(token: string, file: File, draftItemId: number): Promise<void>;
  uploadDraftFile(token: string, file: File): Promise<number>;
  saveSubmission(token: string, assignId: number, draftItemId: number, note?: string): Promise<void>;
  submitForGrading(token: string, assignId: number): Promise<void>;
  getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]>;
}
