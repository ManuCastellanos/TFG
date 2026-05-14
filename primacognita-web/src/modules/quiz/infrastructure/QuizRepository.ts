import type IQuizRepository from '../domain/IQuizRepository';
import type IQuizApi from '../domain/IQuizApi';
import type { AttemptData, ProcessResult, UserAttempt, AttemptReviewData, QuizMeta } from '../domain/IQuizRepository';
import type { QuizAttempt } from '../domain/QuizAttempt';
import type { QuizAnswers } from '../domain/QuizQuestion';

export default class QuizRepository implements IQuizRepository {
  constructor(private readonly api: IQuizApi) {}

  getQuizzesByCourse(token: string, courseId: number): Promise<QuizMeta[]> {
    return this.api.getQuizzesByCourse(token, courseId);
  }

  getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null> {
    return this.api.getQuizByCmid(token, courseId, cmid);
  }

  startAttempt(token: string, quizId: number): Promise<QuizAttempt> {
    return this.api.startAttempt(token, quizId);
  }

  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]> {
    return this.api.getUserAttempts(token, quizId, userId);
  }

  getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData> {
    return this.api.getAttemptData(token, attemptId, page);
  }

  saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean> {
    return this.api.saveAttempt(token, attemptId, answers);
  }

  processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult> {
    return this.api.processAttempt(token, attemptId, answers);
  }

  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData> {
    return this.api.getAttemptReview(token, attemptId);
  }
}
