import type { AssignmentFile } from './AssignmentFile';

export type AssignmentSubmission = {
  id?: number;

  status: 'new' | 'draft' | 'submitted' | 'reopened';

  submittedAt?: number;

  files: AssignmentFile[];

  note?: string;
};

export type AssignmentSubmissionStatus = 'not-submitted' | 'draft' | 'submitted' | 'late' | 'graded';
