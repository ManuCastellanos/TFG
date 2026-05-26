import type IQuizRepository from '../domain/IQuizRepository';
import type IPrimaCognitaApi from '@/shared/infrastructure/api/IPrimaCognitaApi';
import type { AttemptData, ProcessResult, UserAttempt, AttemptReviewData, QuizMeta } from '../domain/IQuizRepository';
import type { QuizAttempt } from '../domain/QuizAttempt';
import type { QuizAnswers } from '../domain/QuizQuestion';
import type { CreateQuizInput, UpdateQuizInput } from '../domain/CreateQuizInput';
import type { QuizSlotQuestion, CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '../domain/QuizQuestionBank';

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

  startAttempt(token: string, quizId: number, password?: string): Promise<QuizAttempt> {
    return this.api.quiz.startAttempt(token, quizId, password);
  }

  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]> {
    return this.api.quiz.getUserAttempts(token, quizId, userId);
  }

  getAttemptData(token: string, attemptId: number, page: number, password?: string): Promise<AttemptData> {
    return this.api.quiz.getAttemptData(token, attemptId, page, password);
  }

  saveAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<boolean> {
    return this.api.quiz.saveAttempt(token, attemptId, answers, password);
  }

  processAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<ProcessResult> {
    return this.api.quiz.processAttempt(token, attemptId, answers, password);
  }

  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData> {
    return this.api.quiz.getAttemptReview(token, attemptId);
  }

  getQuizQuestions(token: string, cmid: number): Promise<QuizSlotQuestion[]> {
    return this.api.quiz.getQuizQuestions(token, cmid);
  }

  createQuestion(token: string, input: CreateQuestionInput): Promise<{ questionId: number; slot: number }> {
    return this.api.quiz.createQuestion(token, input);
  }

  deleteQuestion(token: string, input: DeleteQuestionInput): Promise<void> {
    return this.api.quiz.deleteQuestion(token, input);
  }

  updateQuestion(token: string, input: UpdateQuestionInput): Promise<void> {
    return this.api.quiz.updateQuestion(token, input);
  }
}
