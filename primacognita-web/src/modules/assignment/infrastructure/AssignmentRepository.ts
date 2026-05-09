import type IAssignmentRepository from '../domain/IAssignmentRepository';
import type { Assignment } from '../domain/Assignment';
import type { UpcomingAssignment } from '../domain/UpcomingAssignment';
import type { AssignmentsApiResponse } from './AssignmentResponse';
import type { SubmissionStatusResponse } from './SubmissionResponse';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import { env } from '@/shared/utils/env';
import { parseAssignment } from './parseAssignment';
import { parseSubmissionStatus } from './parseSubmissionStatus';

type UploadResponse = Array<{
  itemid: number;
}>;

export default class AssignmentRepository implements IAssignmentRepository {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null> {
    const assignResponse = await this.moodleClient.call<AssignmentsApiResponse>(
      token,
      'mod_assign_get_assignments',
      { 'courseids[0]': String(courseId) },
    );

    const raw = assignResponse.courses?.[0]?.assignments.find((a) => a.cmid === cmid);
    if (!raw) return null;

    const statusResponse = await this.moodleClient
      .call<SubmissionStatusResponse>(token, 'mod_assign_get_submission_status', {
        assignid: String(raw.id),
        userid: String(userId),
      })
      .catch(() => ({}) as SubmissionStatusResponse);

    void this.moodleClient
      .call<unknown>(token, 'mod_assign_view_assign', { assignid: String(raw.id) })
      .catch(() => undefined);

    const base = parseAssignment(raw);
    const parsed = parseSubmissionStatus(statusResponse, base.dueDate);

    return {
      ...base,
      submissionStatus: parsed.submissionStatus,
      isSubmitted: parsed.isSubmitted,
      isDraft: parsed.isDraft,
      isGraded: parsed.isGraded,
      grade: parsed.grade,
      submission: parsed.submission,
    };
  }

  async getDraftItemId(token: string): Promise<number> {
    const { itemid } = await this.moodleClient.call<{ itemid: number }>(
      token,
      'core_files_get_unused_draft_itemid',
      {},
    );
    return itemid;
  }

  async uploadFileToDraft(token: string, file: File, draftItemId: number): Promise<void> {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('filearea', 'draft');
    formData.append('itemid', String(draftItemId));
    formData.append('filepath', '/');
    formData.append('filename', file.name);
    formData.append('file_1', file, file.name);

    const response = await fetch(`${env.baseUrl}/webservice/upload.php`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`Upload fallido: ${response.statusText}`);

    const data = (await response.json()) as UploadResponse;
    if (!Array.isArray(data) || !data[0]?.itemid) {
      throw new Error('Respuesta de upload inválida del servidor.');
    }
  }

  async uploadDraftFile(token: string, file: File): Promise<number> {
    const itemid = await this.getDraftItemId(token);
    await this.uploadFileToDraft(token, file, itemid);
    return itemid;
  }

  async saveSubmission(token: string, assignId: number, draftItemId: number, note?: string): Promise<void> {
    const params: Record<string, string> = {
      assignmentid: String(assignId),
      'plugindata[files_filemanager]': String(draftItemId),
    };
    if (note) {
      params['plugindata[onlinetext_editor][text]'] = note;
      params['plugindata[onlinetext_editor][format]'] = '1';
      params['plugindata[onlinetext_editor][itemid]'] = String(draftItemId);
    }
    await this.moodleClient.call<unknown>(token, 'mod_assign_save_submission', params);
  }

  async submitForGrading(token: string, assignId: number): Promise<void> {
    await this.moodleClient.call<unknown>(token, 'mod_assign_submit_for_grading', {
      assignmentid: String(assignId),
      acceptsubmissionstatement: '1',
    });
  }

  async getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]> {
    const assignResponse = await this.moodleClient.call<AssignmentsApiResponse>(
      token,
      'mod_assign_get_assignments',
      { 'courseids[0]': String(courseId) },
    );

    const assignments = assignResponse.courses?.[0]?.assignments ?? [];
    const nowSecs = Date.now() / 1000;
    const future = assignments.filter((a) => a.duedate && a.duedate > nowSecs);

    const statuses = await Promise.all(
      future.map((a) =>
        this.moodleClient
          .call<SubmissionStatusResponse>(token, 'mod_assign_get_submission_status', {
            assignid: String(a.id),
            userid: String(userId),
          })
          .catch(() => null),
      ),
    );

    return future
      .filter((_, i) => {
        const raw = statuses[i]?.lastattempt?.submission?.status;
        return raw !== 'submitted';
      })
      .map((a) => ({ id: a.id, cmId: a.cmid, name: a.name, dueDate: a.duedate! }))
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3);
  }
}
