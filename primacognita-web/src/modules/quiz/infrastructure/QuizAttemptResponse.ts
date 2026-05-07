export type QuizAttemptRaw = {
  id: number;
  quiz: number;
  userid: number;
  attempt: number;
  uniqueid: number;
  layout: string;
  currentpage: number;
  state: string;
  timestart: number;
  timefinish: number;
  timemodified: number;
  timemodifiedoffline: number;
  timecheckstate: number;
  sumgrades: number | null;
};

export type QuizQuestionRaw = {
  slot: number;
  type: string;
  page: number;
  html: string;
  responsefileareas: unknown[];
  flags: unknown;
  status: string;
};

export type StartAttemptResponse = {
  attempt: QuizAttemptRaw;
  warnings: unknown[];
};

export type GetAttemptDataResponse = {
  attempt: QuizAttemptRaw;
  questions: QuizQuestionRaw[];
  nextpage: number;
  messages: unknown[];
  warnings: unknown[];
};

export type SaveAttemptResponse = {
  status: boolean;
  warnings: unknown[];
};

export type GetUserAttemptsResponse = {
  attempts: QuizAttemptRaw[];
  warnings: unknown[];
};

export type ProcessAttemptResponse = {
  state: string;
  warnings: unknown[];
};

export type ReviewQuestionRaw = {
  slot: number;
  type: string;
  page: number;
  html: string;
  state: string;
  mark: number | null;
  maxmark: number;
  number: number;
};

export type GetAttemptReviewResponse = {
  grade: string;
  attempt: QuizAttemptRaw;
  questions: ReviewQuestionRaw[];
  warnings: unknown[];
};
