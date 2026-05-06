import type { QuizAttempt } from './QuizAttempt';
import type { QuizQuestion, QuizAnswers } from './QuizQuestion';

export type AttemptData = {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
  nextPage: number;
};

export type ProcessResult = {
  attempt: QuizAttempt;
  grade: number;
};

export default interface IQuizRepository {
  startAttempt(token: string, quizId: number): Promise<QuizAttempt>;
  getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData>;
  saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean>;
  processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult>;
}
