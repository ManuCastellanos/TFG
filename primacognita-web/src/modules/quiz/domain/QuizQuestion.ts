export interface QuizQuestion {
  slot: number;
  type: string;
  page: number;
  html: string;
  status: string;
}

export type QuizAnswers = Record<string, string>;
