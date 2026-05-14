export type CreateAssignmentInput = {
  courseId: number;
  sectionNum: number;
  name: string;
  intro?: string;
  dueDate?: number;
  maxGrade: number;
  allowFile: boolean;
  allowText: boolean;
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
