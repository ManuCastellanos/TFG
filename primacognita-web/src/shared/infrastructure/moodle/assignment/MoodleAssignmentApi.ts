import type IMoodleAssignmentApi from './IMoodleAssignmentApi';
import type IMoodleClient from '@/shared/clients/IMoodleClient';
import type { Assignment } from '@/modules/assignment/domain/Assignment';
import type { AssignmentMeta } from '@/modules/assignment/domain/AssignmentMeta';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import type { SubmissionEntry } from '@/modules/assignment/domain/SubmissionEntry';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import type { CreateAssignmentInput, UpdateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';
import type { AssignmentsApiResponse } from '@/modules/assignment/infrastructure/AssignmentResponse';
import type { SubmissionStatusResponse } from '@/modules/assignment/infrastructure/SubmissionResponse';
import type { SubmissionsApiResponse } from '@/modules/assignment/infrastructure/SubmissionsResponse';
import type { GradesApiResponse } from '@/modules/assignment/infrastructure/GradesResponse';
import { parseAssignment } from '@/modules/assignment/infrastructure/parseAssignment';
import { parseSubmissionStatus } from '@/modules/assignment/infrastructure/parseSubmissionStatus';
import { env } from '@/shared/utils/env';

export default class MoodleAssignmentApi implements IMoodleAssignmentApi {
  constructor(private readonly moodleClient: IMoodleClient) {}

  async getAssignment(token: string, courseId: number, cmid: number, userId: number): Promise<Assignment | null> {
    const assignResponse = await this.moodleClient.call<AssignmentsApiResponse>(token, 'mod_assign_get_assignments', {
      'courseids[0]': String(courseId),
    });
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

    const data = (await response.json()) as Array<{ itemid: number }>;
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
      params['plugindata[onlinetext_editor][itemid]'] = '0';
    }
    // mod_assign_save_submission returns an array of warnings on failure (not exceptions)
    const warnings = await this.moodleClient.call<Array<{ warningcode: string; message: string; item?: string }>>(
      token, 'mod_assign_save_submission', params,
    );
    if (Array.isArray(warnings) && warnings.length > 0) {
      console.error('[saveSubmission] Moodle warnings:', warnings);
      // `item` contains the human-readable reason; `message` is the generic "Could not save submission."
      throw new Error(warnings[0].item ?? warnings[0].message ?? warnings[0].warningcode);
    }
  }

  async submitForGrading(token: string, assignId: number): Promise<void> {
    // Returns warnings array — non-empty is expected when submissiondrafts=0 (already submitted)
    // so we only log the result without throwing
    const warnings = await this.moodleClient.call<Array<{ warningcode: string; message: string }>>(
      token, 'mod_assign_submit_for_grading', {
        assignmentid: String(assignId),
        acceptsubmissionstatement: '1',
      },
    );
    if (Array.isArray(warnings) && warnings.length > 0) {
      console.warn('[submitForGrading] Moodle warnings (expected when submissiondrafts=0):', warnings);
    }
  }

  async getAssignmentsForCourse(token: string, courseId: number): Promise<AssignmentMeta[]> {
    const response = await this.moodleClient.call<AssignmentsApiResponse>(token, 'mod_assign_get_assignments', {
      'courseids[0]': String(courseId),
    });
    return (response.courses?.[0]?.assignments ?? []).map((raw) => ({
      id: raw.id,
      cmId: raw.cmid,
      title: raw.name,
      description: raw.intro ?? '',
      dueDate: raw.duedate ? raw.duedate * 1000 : undefined,
      maxGrade: raw.grade ?? 10,
    }));
  }

  async getSubmissionsForAssignments(token: string, assignIds: number[]): Promise<Record<number, SubmissionEntry[]>> {
    if (assignIds.length === 0) return {};
    const params: Record<string, string> = { status: 'submitted' };
    assignIds.forEach((id, i) => { params[`assignmentids[${i}]`] = String(id); });

    const response = await this.moodleClient.call<SubmissionsApiResponse>(token, 'mod_assign_get_submissions', params);
    const result: Record<number, SubmissionEntry[]> = {};

    for (const assignment of response.assignments ?? []) {
      result[assignment.assignmentid] = (assignment.submissions ?? []).map((s) => {
        const pluginMap = new Map(s.plugins?.map((p) => [p.type, p]) ?? []);
        const filePlugin = pluginMap.get('file');
        const fileArea =
          filePlugin?.fileareas?.find((a) => a.area === 'submission_files') ?? filePlugin?.fileareas?.[0];
        const files = (fileArea?.files ?? []).map((f) => ({
          filename: f.filename,
          fileUrl: f.fileurl,
          fileSize: f.filesize,
          mimeType: f.mimetype,
          uploadedAt: f.timemodified ? f.timemodified * 1000 : undefined,
        }));
        const notePlugin = pluginMap.get('onlinetext');
        const note = notePlugin?.editorfields?.find((e) => e.name === 'onlinetext')?.text ?? undefined;
        return {
          userId: s.userid,
          status: s.status as SubmissionEntry['status'],
          submittedAt: s.timemodified ? s.timemodified * 1000 : undefined,
          files,
          note,
        };
      });
    }
    return result;
  }

  async getGradesForAssignments(token: string, assignIds: number[]): Promise<Record<number, GradeEntry[]>> {
    if (assignIds.length === 0) return {};
    const params: Record<string, string> = {};
    assignIds.forEach((id, i) => { params[`assignmentids[${i}]`] = String(id); });

    const response = await this.moodleClient.call<GradesApiResponse>(token, 'mod_assign_get_grades', params);
    const result: Record<number, GradeEntry[]> = {};
    for (const assignment of response.assignments ?? []) {
      result[assignment.assignmentid] = (assignment.grades ?? []).map((g) => ({
        userId: g.userid,
        grade: g.grade,
        gradedAt: g.timemodified ? g.timemodified * 1000 : undefined,
      }));
    }
    return result;
  }

  async saveGrade(token: string, assignId: number, userId: number, grade: number, feedback: string): Promise<void> {
    await this.moodleClient.call<unknown>(token, 'mod_assign_save_grade', {
      assignmentid: String(assignId),
      userid: String(userId),
      grade: String(grade),
      attemptnumber: '-1',
      addattempt: '0',
      workflowstate: 'graded',
      applytoall: '0',
      'plugindata[assignfeedbackcomments_editor][text]': feedback,
      'plugindata[assignfeedbackcomments_editor][format]': '1',
    });
  }

  async getUpcomingAssignments(token: string, courseId: number, userId: number): Promise<UpcomingAssignment[]> {
    const assignResponse = await this.moodleClient.call<AssignmentsApiResponse>(token, 'mod_assign_get_assignments', {
      'courseids[0]': String(courseId),
    });
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
      .flatMap((a, i) => {
        const raw = statuses[i]?.lastattempt?.submission?.status;
        return raw !== 'submitted' ? [{ id: a.id, cmId: a.cmid, name: a.name, dueDate: a.duedate! }] : [];
      })
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3);
  }

  async createAssignment(token: string, input: CreateAssignmentInput): Promise<{ cmid: number; assignmentId: number }> {
    const result = await this.moodleClient.call<{ cmid: number; assignmentid: number }>(
      token, 'local_primacognita_create_assignment', {
        courseid:                 String(input.courseId),
        sectionnum:               String(input.sectionNum),
        name:                     input.name,
        intro:                    input.intro ?? '',
        allowsubmissionsfromdate: String(input.allowSubmissionsFromDate ? Math.floor(input.allowSubmissionsFromDate / 1000) : 0),
        duedate:                  String(input.dueDate ? Math.floor(input.dueDate / 1000) : 0),
        cutoffdate:               String(input.cutoffDate ? Math.floor(input.cutoffDate / 1000) : 0),
        maxgrade:                 String(input.maxGrade),
        gradepass:                String(input.gradePass ?? 0),
        allowfile:                input.allowFile ? '1' : '0',
        allowtext:                input.allowText ? '1' : '0',
        maxfilesubmissions:       String(input.maxFileSubmissions ?? 1),
        acceptedfiletypes:        input.acceptedFileTypes ?? '',
        submissiondrafts:         input.submissionDrafts ? '1' : '0',
        sendnotifications:        input.sendNotifications ? '1' : '0',
        activitydraftitemid:      String(input.activityDraftItemId ?? 0),
      },
    );
    return { cmid: result.cmid, assignmentId: result.assignmentid };
  }

  async updateAssignment(token: string, input: UpdateAssignmentInput): Promise<void> {
    await this.moodleClient.call<unknown>(token, 'local_primacognita_update_assignment', {
      cmid:      String(input.cmid),
      name:      input.name ?? '',
      intro:     input.intro ?? '',
      duedate:   String(input.dueDate ? Math.floor(input.dueDate / 1000) : 0),
      maxgrade:  String(input.maxGrade ?? 10),
      allowfile: input.allowFile !== false ? '1' : '0',
      allowtext: input.allowText ? '1' : '0',
    });
  }
}
