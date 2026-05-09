import type { AssignmentGrade } from './AssignmentGrade';
import type { AssignmentSubmission, AssignmentSubmissionStatus } from './AssignmentSubmission';

export type Assignment = {
  id: number;
  cmId: number;

  title: string;
  description: string;

  dueDate?: number;
  openDate?: number;
  cutoffDate?: number;

  maxGrade: number;
  passGrade?: number;

  maxFiles: number;
  maxFileSizeBytes: number;

  acceptedTypes: string[];

  submissionStatus: AssignmentSubmissionStatus;

  isSubmitted: boolean;
  isDraft: boolean;
  isGraded: boolean;

  grade?: AssignmentGrade;

  submission?: AssignmentSubmission;
};
