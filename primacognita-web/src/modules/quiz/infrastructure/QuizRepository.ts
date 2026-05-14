import type IQuizRepository from '../domain/IQuizRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { AttemptData, ProcessResult, UserAttempt, AttemptReviewData, QuizMeta } from '../domain/IQuizRepository';
import type { QuizAttempt } from '../domain/QuizAttempt';
import type { QuizAnswers } from '../domain/QuizQuestion';
import type { CreateQuizInput, UpdateQuizInput } from '../domain/CreateQuizInput';

export default class QuizRepository implements IQuizRepository {
  constructor(private readonly api: IPrimaCognitaApi) {}

  createQuiz(token: string, input: CreateQuizInput): Promise<{ cmid: number; quizId: number }> {
    return this.api.quiz.createQuiz(token, input);
  }

  updateQuiz(token: string, input: UpdateQuizInput): Promise<void> {
    return this.api.quiz.updateQuiz(token, input);
  }

  getQuizzesByCourse(token: string, courseId: number): Promise<QuizMeta[]> {
    return this.api.quiz.getQuizzesByCourse(token, courseId);
  }

  getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null> {
    return this.api.quiz.getQuizByCmid(token, courseId, cmid);
  }

  startAttempt(token: string, quizId: number): Promise<QuizAttempt> {
    return this.api.quiz.startAttempt(token, quizId);
  }

  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]> {
    return this.api.quiz.getUserAttempts(token, quizId, userId);
  }

  getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData> {
    return this.api.quiz.getAttemptData(token, attemptId, page);
  }

  saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean> {
    return this.api.quiz.saveAttempt(token, attemptId, answers);
  }

  processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult> {
    return this.api.quiz.processAttempt(token, attemptId, answers);
  }

  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData> {
    return this.api.quiz.getAttemptReview(token, attemptId);
  }
}
