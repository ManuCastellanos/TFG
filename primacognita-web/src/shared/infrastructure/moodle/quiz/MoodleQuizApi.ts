import type IMoodleQuizApi from './IMoodleQuizApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { QuizAttempt } from '@/modules/quiz/domain/QuizAttempt';
import type { QuizAnswers } from '@/modules/quiz/domain/QuizQuestion';
import type { AttemptData, AttemptReviewData, ProcessResult, QuizMeta, UserAttempt } from '@/modules/quiz/domain/IQuizRepository';
import type { CreateQuizInput, UpdateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';
import type { QuizSlotQuestion, CreateQuestionInput, DeleteQuestionInput, UpdateQuestionInput } from '@/modules/quiz/domain/QuizQuestionBank';
import type {
  QuizAttemptRaw,
  StartAttemptResponse,
  GetAttemptDataResponse,
  GetUserAttemptsResponse,
  SaveAttemptResponse,
  ProcessAttemptResponse,
  GetAttemptReviewResponse,
} from '@/modules/quiz/infrastructure/QuizAttemptResponse';
import type { QuizzesApiResponse } from '@/modules/quiz/infrastructure/QuizResponse';
import { QUIZ_GRADING_METHOD } from '@/modules/quiz/infrastructure/QuizResponse';
import { env } from '@/shared/utils/env';

function mapAttempt(raw: QuizAttemptRaw): QuizAttempt {
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

function buildAnswerParams(attemptId: number, answers: QuizAnswers): Record<string, string> {
  const params: Record<string, string> = { attemptid: String(attemptId) };
  Object.entries(answers).forEach(([name, value], i) => {
    params[`data[${i}][name]`] = name;
    params[`data[${i}][value]`] = value;
  });
  return params;
}

export default class MoodleQuizApi implements IMoodleQuizApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getQuizzesByCourse(token: string, courseId: number): Promise<QuizMeta[]> {
    const response = await this.moodleClient.call<QuizzesApiResponse>(
      token,
      'mod_quiz_get_quizzes_by_courses',
      { 'courseids[0]': String(courseId) },
    );
    return (response.quizzes ?? []).map((raw) => ({
      id: raw.id,
      cmid: raw.coursemodule,
      courseId,
      title: raw.name,
      description: raw.intro ?? '',
      openDate: raw.timeopen ? new Date(raw.timeopen * 1000) : undefined,
      dueDate: raw.timeclose ? new Date(raw.timeclose * 1000) : undefined,
      gradeMax: raw.grade ?? 10,
      sumgrades: raw.sumgrades,
      gradePass: raw.gradepass,
      gradingMethod: raw.grademethod != null ? QUIZ_GRADING_METHOD[raw.grademethod] : undefined,
      hasPassword: (raw.haspassword ?? 0) === 1,
      maxAttempts: raw.attempts,
      viewUrl: `${env.baseUrl}/mod/quiz/view.php?id=${raw.coursemodule}`,
    }));
  }

  async getQuizByCmid(token: string, courseId: number, cmid: number): Promise<QuizMeta | null> {
    const response = await this.moodleClient.call<QuizzesApiResponse>(
      token,
      'mod_quiz_get_quizzes_by_courses',
      { 'courseids[0]': String(courseId) },
    );
    const raw = response.quizzes?.find((q) => q.coursemodule === cmid);
    console.debug('[QuizApi] → matched: %s', raw ? `id=${raw.id}` : 'NO MATCH');
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
      hasPassword: (raw.haspassword ?? 0) === 1,
      maxAttempts: raw.attempts,
      viewUrl: `${env.baseUrl}/mod/quiz/view.php?id=${cmid}`,
    };
  }

  async startAttempt(token: string, quizId: number, password?: string): Promise<QuizAttempt> {
    const params: Record<string, string> = { quizid: String(quizId) };
    if (password) {
      params['preflightdata[0][name]'] = 'quizpassword';
      params['preflightdata[0][value]'] = password;
    }
    const response = await this.moodleClient.call<StartAttemptResponse>(
      token,
      'mod_quiz_start_attempt',
      params,
    );
    return mapAttempt(response.attempt);
  }

  async getUserAttempts(token: string, quizId: number, userId: number): Promise<UserAttempt[]> {
    const response = await this.moodleClient.call<GetUserAttemptsResponse>(
      token,
      'mod_quiz_get_user_quiz_attempts',
      { quizid: String(quizId), userid: String(userId), status: 'all' },
    );
    return response.attempts.map((a) => mapAttempt(a));
  }

  async getAttemptData(token: string, attemptId: number, page: number, password?: string): Promise<AttemptData> {
    const params: Record<string, string> = { attemptid: String(attemptId), page: String(page) };
    if (password) {
      params['preflightdata[0][name]'] = 'quizpassword';
      params['preflightdata[0][value]'] = password;
    }
    const response = await this.moodleClient.call<GetAttemptDataResponse>(
      token,
      'mod_quiz_get_attempt_data',
      params,
    );
    return {
      attempt: mapAttempt(response.attempt),
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

  async saveAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<boolean> {
    const params = buildAnswerParams(attemptId, answers);
    if (password) {
      params['preflightdata[0][name]'] = 'quizpassword';
      params['preflightdata[0][value]'] = password;
    }
    const response = await this.moodleClient.call<SaveAttemptResponse>(
      token,
      'mod_quiz_save_attempt',
      params,
    );
    return response.status;
  }

  async processAttempt(token: string, attemptId: number, answers: QuizAnswers, password?: string): Promise<ProcessResult> {
    const params: Record<string, string> = {
      ...buildAnswerParams(attemptId, answers),
      finishattempt: '1',
      timeup: '0',
    };
    if (password) {
      params['preflightdata[0][name]'] = 'quizpassword';
      params['preflightdata[0][value]'] = password;
    }
    const response = await this.moodleClient.call<ProcessAttemptResponse>(
      token,
      'mod_quiz_process_attempt',
      params,
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

  async createQuiz(token: string, input: CreateQuizInput): Promise<{ cmid: number; quizId: number }> {
    const result = await this.moodleClient.call<{ cmid: number; quizid: number }>(
      token, 'local_primacognita_create_quiz', {
        courseid:               String(input.courseId),
        sectionnum:             String(input.sectionNum),
        name:                   input.name,
        intro:                  input.intro ?? '',
        timeopen:               String(input.timeOpen ? Math.floor(input.timeOpen / 1000) : 0),
        timeclose:              String(input.timeClose ? Math.floor(input.timeClose / 1000) : 0),
        timelimit:              String(input.timeLimitMinutes ? input.timeLimitMinutes * 60 : 0),
        maxattempts:            String(input.maxAttempts ?? 0),
        shufflequestions:       String(input.shuffleQuestions ? 1 : 0),
        shuffleanswers:         String(input.shuffleAnswers ? 1 : 0),
        showresultsimmediately: String(input.showResultsImmediately ? 1 : 0),
        visible:                String(input.visible === false ? 0 : 1),
        password:               input.password ?? '',
        quizdraftitemid:        String(input.quizDraftItemId ?? 0),
      },
    );
    return { cmid: result.cmid, quizId: result.quizid };
  }

  async getQuizQuestions(token: string, cmid: number): Promise<QuizSlotQuestion[]> {
    const result = await this.moodleClient.call<{
      slot: number; slotid: number; questionid: number; qtype: string;
      name: string; questiontext: string;
      answers: { text: string; iscorrect: number }[];
      correctanswer: number;
    }[]>(token, 'local_primacognita_get_quiz_questions', { cmid: String(cmid) });

    return result.map((r) => ({
      slot: r.slot,
      slotId: r.slotid,
      questionId: r.questionid,
      type: r.qtype as 'multichoice' | 'truefalse',
      name: r.name,
      questionText: r.questiontext,
      answers: r.answers.map((a) => ({ text: a.text, isCorrect: a.iscorrect === 1 })),
      correctAnswer: r.correctanswer === -1 ? undefined : r.correctanswer === 1,
    }));
  }

  async createQuestion(token: string, input: CreateQuestionInput): Promise<{ questionId: number; slot: number }> {
    const params: Record<string, string> = {
      cmid:          String(input.cmid),
      qtype:         input.qtype,
      name:          input.name,
      questiontext:  input.questionText,
      correctindex:  String(input.correctIndex ?? 0),
      correctanswer: String(input.correctAnswer ? 1 : 0),
    };
    (input.answers ?? []).forEach((text, i) => {
      params[`answers[${i}]`] = text;
    });
    (input.correctIndices ?? []).forEach((idx, i) => {
      params[`correctindices[${i}]`] = String(idx);
    });
    const result = await this.moodleClient.call<{ questionid: number; slot: number }>(
      token, 'local_primacognita_create_question', params,
    );
    return { questionId: result.questionid, slot: result.slot };
  }

  async deleteQuestion(token: string, input: DeleteQuestionInput): Promise<void> {
    await this.moodleClient.call<{ success: boolean }>(
      token, 'local_primacognita_delete_question', {
        cmid:   String(input.cmid),
        slotid: String(input.slotId),
      },
    );
  }

  async updateQuestion(token: string, input: UpdateQuestionInput): Promise<void> {
    const params: Record<string, string> = {
      cmid:          String(input.cmid),
      questionid:    String(input.questionId),
      questiontext:  input.questionText,
      correctindex:  String(input.correctIndex ?? 0),
      correctanswer: String(input.correctAnswer ? 1 : 0),
    };
    (input.answers ?? []).forEach((text, i) => {
      params[`answers[${i}]`] = text;
    });
    (input.correctIndices ?? []).forEach((idx, i) => {
      params[`correctindices[${i}]`] = String(idx);
    });
    await this.moodleClient.call<{ success: boolean }>(
      token, 'local_primacognita_update_question', params,
    );
  }

  async updateQuiz(token: string, input: UpdateQuizInput): Promise<void> {
    await this.moodleClient.call<unknown>(token, 'local_primacognita_update_quiz', {
      cmid:      String(input.cmid),
      name:      input.name ?? '',
      intro:     input.intro ?? '',
      timeopen:  String(input.timeOpen ? Math.floor(input.timeOpen / 1000) : 0),
      timeclose: String(input.timeClose ? Math.floor(input.timeClose / 1000) : 0),
      timelimit: String(input.timeLimit ?? 0),
    });
  }
}
