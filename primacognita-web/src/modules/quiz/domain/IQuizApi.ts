import type { QuizAttempt } from './QuizAttempt';
import type { QuizAnswers } from './QuizQuestion';
import type { AttemptData, AttemptReviewData, ProcessResult, QuizMeta, UserAttempt } from './IQuizRepository';

export default interface IQuizApi {
  getQuizzesByCourse(token: string, courseId: number): Promise<QuizMeta[]>;
  getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null>;
  startAttempt(token: string, quizId: number): Promise<QuizAttempt>;
  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]>;
  getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData>;
  saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean>;
  processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult>;
  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData>;
}
