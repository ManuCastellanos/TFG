import type { AssignmentFile } from './AssignmentFile';

export type SubmissionEntry = {
  userId: number;
  status: 'new' | 'draft' | 'submitted' | 'reopened';
  submittedAt?: number;
  files: AssignmentFile[];
  note?: string;
};
