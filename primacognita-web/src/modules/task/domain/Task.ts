export type TaskModName = "assign" | "quiz";

export interface TaskStatus {
  submitted: boolean;
  graded: boolean;
  grade?: number;
  submittedAt?: Date;
}

export interface Task {
  id: number;
  cmid: number;
  courseId: number;
  modName: TaskModName;
  title: string;
  description: string;
  openDate?: Date;
  dueDate?: Date;
  gradeMax: number;
  gradePass?: number;
  gradingMethod?: string;
  viewUrl: string;
  status: TaskStatus;
}
