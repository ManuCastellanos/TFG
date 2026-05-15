export type CreateAssignmentInput = {
  courseId: number;
  sectionNum: number;
  name: string;
  intro?: string;
  allowSubmissionsFromDate?: number;
  dueDate?: number;
  cutoffDate?: number;
  maxGrade: number;
  gradePass?: number;
  allowFile: boolean;
  allowText: boolean;
  maxFileSubmissions?: number;
  acceptedFileTypes?: string;
  submissionDrafts?: boolean;
  sendNotifications?: boolean;
  activityDraftItemId?: number;
};

export type UpdateAssignmentInput = {
  cmid: number;
  name?: string;
  intro?: string;
  dueDate?: number;
  maxGrade?: number;
  allowFile?: boolean;
  allowText?: boolean;
};
