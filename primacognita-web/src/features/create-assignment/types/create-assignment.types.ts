export type CreateAssignmentFormValues = {
  name: string;
  intro: string;
  allowSubmissionsFromDate: string;
  dueDate: string;
  cutoffSameAsDue: boolean;
  cutoffDate: string;
  maxGrade: number;
  gradePass: number | '';
  allowFile: boolean;
  allowText: boolean;
  maxFileSubmissions: number;
  acceptedFileTypes: string;
  submissionDrafts: boolean;
  sendNotifications: boolean;
};
