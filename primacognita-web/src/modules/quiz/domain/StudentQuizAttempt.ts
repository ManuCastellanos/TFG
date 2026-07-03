export type StudentQuizAttemptStatus = 'graded' | 'in_progress' | 'not_attempted';

export type StudentQuizAttempt = {
  userId: number;
  userFullName: string;
  userInitials: string;
  colorIdx: number;
  status: StudentQuizAttemptStatus;
  bestGrade: string | null;
  attemptsCount: number;
  lastAttemptId: number | null;
};
