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
  configs?: Array<{
    plugin: string;
    subtype: string;
    name: string;
    value: string;
  }>;
};

export type AssignmentsApiResponse = {
  courses: Array<{
    id: number;
    assignments: AssignmentRaw[];
  }>;
};
