import type { SubmissionFileRaw } from './SubmissionResponse';

export type RawSubmissionPlugin = {
  type: string;
  name: string;
  fileareas?: Array<{
    area: string;
    files: SubmissionFileRaw[];
  }>;
  editorfields?: Array<{
    name: string;
    text: string;
  }>;
};

export type RawSubmission = {
  id: number;
  userid: number;
  status: string;
  timemodified?: number;
  plugins?: RawSubmissionPlugin[];
};

export type SubmissionsApiResponse = {
  assignments: Array<{
    assignmentid: number;
    submissions: RawSubmission[];
  }>;
};
