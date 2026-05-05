export type AssignmentRaw = {
  id: number;
  cmid: number;
  name: string;
  intro?: string;
  duedate?: number;
  allowsubmissionsfromdate?: number;
  cutoffdate?: number;
  grade?: number;
  gradepass?: number;
};

export type AssignmentsApiResponse = {
  courses: Array<{
    id: number;
    assignments: AssignmentRaw[];
  }>;
};
