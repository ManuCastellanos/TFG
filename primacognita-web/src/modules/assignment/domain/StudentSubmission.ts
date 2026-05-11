import type { AssignmentFile } from './AssignmentFile';

export type StudentSubmissionStatus = 'submitted' | 'graded' | 'late' | 'missing';

export type StudentSubmission = {
  userId: number;
  userFullName: string;
  userInitials: string;
  colorIdx: number;
  status: StudentSubmissionStatus;
  submittedAt?: number;
  files: AssignmentFile[];
  gradeStr?: string;
  note?: string;
};
