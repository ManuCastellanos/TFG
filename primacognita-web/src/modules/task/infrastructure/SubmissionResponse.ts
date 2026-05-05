export type SubmissionStatusResponse = {
  lastattempt?: {
    submission?: {
      status: string;
      timemodified?: number;
      plugins?: Array<{
        type: string;
        editorfields?: Array<{ text: string }>;
        fileareas?: Array<{
          files: Array<{ filename: string; fileurl: string }>;
        }>;
      }>;
    };
  };
  feedback?: {
    grade?: {
      grade: string;
    };
  };
};
