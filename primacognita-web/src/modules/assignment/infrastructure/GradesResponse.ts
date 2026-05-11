export type RawGrade = {
  id: number;
  assignment: number;
  userid: number;
  attemptnumber: number;
  timecreated?: number;
  timemodified?: number;
  grader?: number;
  grade: string;
};

export type GradesApiResponse = {
  assignments: Array<{
    assignmentid: number;
    grades: RawGrade[];
  }>;
};
