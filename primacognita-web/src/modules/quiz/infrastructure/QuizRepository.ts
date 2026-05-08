import type IQuizRepository from '../domain/IQuizRepository';
import type { AttemptData, ProcessResult, UserAttempt, AttemptReviewData, QuizMeta } from '../domain/IQuizRepository';
import type { QuizAttempt } from '../domain/QuizAttempt';
import type { QuizAnswers } from '../domain/QuizQuestion';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type {
  QuizAttemptRaw,
  StartAttemptResponse,
  GetAttemptDataResponse,
  GetUserAttemptsResponse,
  SaveAttemptResponse,
  ProcessAttemptResponse,
  GetAttemptReviewResponse,
} from './QuizAttemptResponse';
import type { QuizzesApiResponse } from './QuizResponse';
import { QUIZ_GRADING_METHOD } from './QuizResponse';
import { env } from '@/shared/utils/env';

export default class QuizRepository implements IQuizRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null> {
    const response = await this.moodleClient.call<QuizzesApiResponse>(
      token,
      'mod_quiz_get_quizzes_by_courses',
      { 'courseids[0]': String(courseId) },
    );

    const raw = response.quizzes?.find((q) => q.coursemodule === cmid);
    if (!raw) return null;

    return {
      id: raw.id,
      cmid,
      courseId,
      title: raw.name,
      description: raw.intro ?? '',
      openDate: raw.timeopen ? new Date(raw.timeopen * 1000) : undefined,
      dueDate: raw.timeclose ? new Date(raw.timeclose * 1000) : undefined,
      gradeMax: raw.grade ?? 10,
      gradePass: raw.gradepass,
      gradingMethod: raw.grademethod != null ? QUIZ_GRADING_METHOD[raw.grademethod] : undefined,
      viewUrl: `${env.baseUrl}/mod/quiz/view.php?id=${cmid}`,
    };
  }

  async startAttempt(token: string, quizId: number): Promise<QuizAttempt> {
    const response = await this.moodleClient.call<StartAttemptResponse>(
      token,
      'mod_quiz_start_attempt',
      { quizid: String(quizId) },
    );
    return this.mapAttempt(response.attempt);
  }

  async getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]> {
    const response = await this.moodleClient.call<GetUserAttemptsResponse>(
      token,
      'mod_quiz_get_user_quiz_attempts',
      { quizid: String(quizId), userid: String(userId), status: 'all' },
    );
    return response.attempts.map((a) => this.mapAttempt(a));
  }

  async getAttemptData(token: string, attemptId: number, page: number): Promise<AttemptData> {
    const response = await this.moodleClient.call<GetAttemptDataResponse>(
      token,
      'mod_quiz_get_attempt_data',
      { attemptid: String(attemptId), page: String(page) },
    );
    return {
      attempt: this.mapAttempt(response.attempt),
      questions: response.questions.map((q) => ({
        slot: q.slot,
        type: q.type,
        page: q.page,
        html: q.html,
        status: q.status,
      })),
      nextPage: response.nextpage,
    };
  }

  async saveAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<boolean> {
    const response = await this.moodleClient.call<SaveAttemptResponse>(
      token,
      'mod_quiz_save_attempt',
      this.buildAnswerParams(attemptId, answers),
    );
    return response.status;
  }

  async processAttempt(token: string, attemptId: number, answers: QuizAnswers): Promise<ProcessResult> {
    const response = await this.moodleClient.call<ProcessAttemptResponse>(
      token,
      'mod_quiz_process_attempt',
      {
        ...this.buildAnswerParams(attemptId, answers),
        finishattempt: '1',
        timeup: '0',
      },
    );
    return { state: response.state };
  }

  async getAttemptReview(token: string, attemptId: number): Promise<AttemptReviewData> {
    const response = await this.moodleClient.call<GetAttemptReviewResponse>(
      token,
      'mod_quiz_get_attempt_review',
      { attemptid: String(attemptId) },
    );
    return {
      grade: response.grade,
      questions: response.questions.map((q) => ({
        slot: q.slot,
        type: q.type,
        page: q.page,
        html: q.html,
        state: q.state,
        mark: q.mark,
        maxmark: q.maxmark,
        number: q.number,
      })),
    };
  }

  private mapAttempt(raw: QuizAttemptRaw): QuizAttempt {
    return {
      id: raw.id,
      quizId: raw.quiz,
      userId: raw.userid,
      attemptNumber: raw.attempt,
      uniqueId: raw.uniqueid,
      currentPage: raw.currentpage,
      state: raw.state as QuizAttempt['state'],
      timeStart: raw.timestart,
      timeFinish: raw.timefinish,
      sumGrades: raw.sumgrades,
    };
  }

  private buildAnswerParams(attemptId: number, answers: QuizAnswers): Record<string, string> {
    const params: Record<string, string> = { attemptid: String(attemptId) };
    Object.entries(answers).forEach(([name, value], i) => {
      params[`data[${i}][name]`] = name;
      params[`data[${i}][value]`] = value;
    });
    return params;
  }

}
