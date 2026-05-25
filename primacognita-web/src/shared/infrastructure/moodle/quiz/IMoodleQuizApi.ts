import type { QuizAttempt } from '@/modules/quiz/domain/QuizAttempt';
import type { QuizAnswers } from '@/modules/quiz/domain/QuizQuestion';
import type { AttemptData, AttemptReviewData, ProcessResult, QuizMeta, UserAttempt } from '@/modules/quiz/domain/IQuizRepository';
import type { CreateQuizInput, UpdateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';
import type { QuizSlotQuestion, CreateQuestionInput, DeleteQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';

export default interface IMoodleQuizApi {
  getQuizzesByCourse(token: string, courseId: number): Promise<QuizMeta[]>;
  getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null>;
  startAttempt(token: string, quizId: number, password?: string): Promise<QuizAttempt>;
  getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]>;
  getAttemptData(token: string, attemptId: number, page: number, password?: string): Promise<AttemptData>;
  saveAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<boolean>;
  processAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<ProcessResult>;
  getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData>;
  createQuiz(token: string, input: CreateQuizInput): Promise<{ cmid: number; quizId: number }>;
  updateQuiz(token: string, input: UpdateQuizInput): Promise<void>;
  getQuizQuestions(token: string, cmid: number): Promise<QuizSlotQuestion[]>;
  createQuestion(token: string, input: CreateQuestionInput): Promise<{ questionId: number; slot: number }>;
  deleteQuestion(token: string, input: DeleteQuestionInput): Promise<void>;
}
