export type QuizAttemptState = 'inprogress' | 'finished' | 'abandoned' | 'overdue';

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  attemptNumber: number;
  uniqueId: number;
  currentPage: number;
  state: QuizAttemptState;
  timeStart: number;
  timeFinish: number;
  timeCheckState: number;
  sumGrades: number | null;
}
