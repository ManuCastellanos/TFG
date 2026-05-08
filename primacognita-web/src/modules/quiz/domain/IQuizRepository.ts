import type { QuizAttempt } from './QuizAttempt';
import type { QuizQuestion, QuizAnswers } from './QuizQuestion';

export type UserAttempt = QuizAttempt;

export type AttemptData = {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
  nextPage: number;
};

export type ProcessResult = {
  state: string;
};

export type ReviewQuestion = {
  slot: number;
  type: string;
  page: number;
  html: string;
  state: string; // 'gradedright' | 'gradedwrong' | 'gradedpartial' | 'todo' | 'notanswered'
  mark: number | null;
  maxmark: number;
  number: number;
};

export type AttemptReviewData = {
  grade: string;
  questions: ReviewQuestion[];
};

export interface QuizMeta {
  id: number;
  cmid: number;
  courseId: number;
  title: string;
  description: string;
  openDate?: Date;
  dueDate?: Date;
  gradeMax: number;
  gradePass?: number;
  gradingMethod?: string;
  viewUrl: string;
}

export default interface IQuizRepository {
  getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null>;
  startAttempt(token: string, quizId: number): Promise<QuizAttempt>;
  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]>;
  getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData>;
  saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean>;
  processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult>;
  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData>;
}
