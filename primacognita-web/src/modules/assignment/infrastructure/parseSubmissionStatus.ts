import type { AssignmentFile } from '../domain/AssignmentFile';
import type { AssignmentGrade } from '../domain/AssignmentGrade';
import type { AssignmentSubmission, AssignmentSubmissionStatus } from '../domain/AssignmentSubmission';
import type { SubmissionPluginRaw, SubmissionStatusResponse } from './SubmissionResponse';

function parseFiles(plugins: SubmissionPluginRaw[] | undefined): AssignmentFile[] {
  const filePlugin = plugins?.find((p) => p.type === 'file');
  const fileArea = filePlugin?.fileareas?.find((a) => a.area === 'submission_files') ?? filePlugin?.fileareas?.[0];
  return (fileArea?.files ?? []).map((f) => ({
    filename: f.filename,
    fileUrl: f.fileurl,
    fileSize: f.filesize,
    mimeType: f.mimetype,
    uploadedAt: f.timemodified ? f.timemodified * 1000 : undefined,
  }));
}

function parseNote(plugins: SubmissionPluginRaw[] | undefined): string | undefined {
  const textPlugin = plugins?.find((p) => p.type === 'onlinetext');
  const field = textPlugin?.editorfields?.find((f) => f.name === 'onlinetext') ?? textPlugin?.editorfields?.[0];
  return field?.text || undefined;
}

function calcSubmissionStatus(
  rawStatus: string | undefined,
  hasGrade: boolean,
  dueDate?: number,
): AssignmentSubmissionStatus {
  if (hasGrade) return 'graded';
  if (rawStatus === 'submitted') {
    if (dueDate && Date.now() > dueDate) return 'late';
    return 'submitted';
  }
  if (rawStatus === 'draft') return 'draft';
  return 'not-submitted';
}

export function parseSubmissionStatus(
  response: SubmissionStatusResponse,
  dueDate?: number,
): {
  submission: AssignmentSubmission;
  grade?: AssignmentGrade;
  submissionStatus: AssignmentSubmissionStatus;
  isSubmitted: boolean;
  isDraft: boolean;
  isGraded: boolean;
} {
  const raw = response.lastattempt?.submission;
  const files = parseFiles(raw?.plugins);
  const note = parseNote(raw?.plugins);

  const submission: AssignmentSubmission = {
    id: raw?.id,
    status: (raw?.status as AssignmentSubmission['status']) ?? 'new',
    submittedAt: raw?.timemodified ? raw.timemodified * 1000 : undefined,
    files,
    note,
  };

  const gradeRaw = response.feedback?.grade;
  const feedbackPlugins = response.feedback?.feedbackplugins;

  let grade: AssignmentGrade | undefined;
  if (gradeRaw) {
    const commentPlugin = feedbackPlugins?.find((p) => p.type === 'comments');
    const feedbackText = commentPlugin?.editorfields?.[0]?.text || undefined;

    grade = {
      grade: gradeRaw.grade,
      feedback: feedbackText,
      gradedAt: gradeRaw.timemodified ? gradeRaw.timemodified * 1000 : undefined,
    };
  }

  const isGraded = gradeRaw != null;
  const isSubmitted = raw?.status === 'submitted' || raw?.status === 'reopened';
  const isDraft = raw?.status === 'draft';
  const submissionStatus = calcSubmissionStatus(raw?.status, isGraded, dueDate);

  return { submission, grade, submissionStatus, isSubmitted, isDraft, isGraded };
}
