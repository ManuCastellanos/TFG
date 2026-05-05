import type ITaskRepository from '../domain/ITaskRepository';
import type { Task, TaskStatus } from '../domain/Task';
import type { AssignmentsApiResponse } from './AssignmentResponse';
import type { QuizzesApiResponse } from './QuizResponse';
import { QUIZ_GRADING_METHOD } from './QuizResponse';
import type { SubmissionStatusResponse } from './SubmissionResponse';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import { env } from '@/shared/utils/env';

export default class TaskRepository implements ITaskRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getTaskByCmid(token: string, courseId: number, cmid: number, modName: string): Promise<Task | null> {
    if (modName === 'quiz') return this.getQuizByCmid(token, courseId, cmid);
    return this.getAssignmentByCmid(token, courseId, cmid);
  }

  private async getAssignmentByCmid(token: string, courseId: number, cmid: number): Promise<Task | null> {
    const response = await this.moodleClient.call<AssignmentsApiResponse>(
      token,
      'mod_assign_get_assignments',
      { 'courseids[0]': String(courseId) },
    );

    const raw = response.courses?.[0]?.assignments.find((a) => a.cmid === cmid);
    if (!raw) return null;

    return {
      id: raw.id,
      cmid: raw.cmid,
      courseId,
      modName: 'assign',
      title: raw.name,
      description: raw.intro ?? '',
      openDate: raw.allowsubmissionsfromdate ? new Date(raw.allowsubmissionsfromdate * 1000) : undefined,
      dueDate: raw.duedate ? new Date(raw.duedate * 1000) : undefined,
      gradeMax: raw.grade ?? 10,
      gradePass: raw.gradepass,
      viewUrl: `${env.baseUrl}/mod/assign/view.php?id=${cmid}`,
      status: { submitted: false, graded: false },
    };
  }

  private async getQuizByCmid(token: string, courseId: number, cmid: number): Promise<Task | null> {
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
      modName: 'quiz',
      title: raw.name,
      description: raw.intro ?? '',
      openDate: raw.timeopen ? new Date(raw.timeopen * 1000) : undefined,
      dueDate: raw.timeclose ? new Date(raw.timeclose * 1000) : undefined,
      gradeMax: raw.grade ?? 10,
      gradePass: raw.gradepass,
      gradingMethod: raw.grademethod != null ? QUIZ_GRADING_METHOD[raw.grademethod] : undefined,
      viewUrl: `${env.baseUrl}/mod/quiz/view.php?id=${cmid}`,
      status: { submitted: false, graded: false },
    };
  }

  async getSubmissionStatus(token: string, assignId: number, userId: number): Promise<TaskStatus> {
    try {
      const response = await this.moodleClient.call<SubmissionStatusResponse>(
        token,
        'mod_assign_get_submission_status',
        { assignid: String(assignId), userid: String(userId) },
      );

      const submission = response.lastattempt?.submission;
      const gradeResponse = response.feedback?.grade;

      return {
        submitted: submission?.status === 'submitted',
        graded: gradeResponse != null,
        grade: gradeResponse?.grade != null ? parseFloat(gradeResponse.grade) : undefined,
        submittedAt: submission?.timemodified ? new Date(submission.timemodified * 1000) : undefined,
      };
    } catch {
      return { submitted: false, graded: false };
    }
  }

  async viewAssign(token: string, assignId: number): Promise<void> {
    await this.moodleClient.call<unknown>(
      token,
      'mod_assign_view_assign',
      { assignid: String(assignId) },
    );
  }
}
