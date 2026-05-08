export type SubmissionFileRaw = {
  filename: string;
  fileurl: string;
  filesize: number;
  mimetype?: string;
  timemodified?: number;
};

export type SubmissionPluginRaw = {
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

export type SubmissionStatusResponse = {
  lastattempt?: {
    submission?: {
      id?: number;
      status: string;
      timemodified?: number;
      plugins?: SubmissionPluginRaw[];
    };
  };
  feedback?: {
    grade?: {
      grade: string;
      timemodified?: number;
      grader?: number;
    };
    feedbackplugins?: SubmissionPluginRaw[];
  };
};
