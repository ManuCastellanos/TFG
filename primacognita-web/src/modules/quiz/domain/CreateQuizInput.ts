export type CreateQuizInput = {
  courseId: number;
  sectionNum: number;
  name: string;
  intro?: string;
  timeOpen?: number;              // Unix ms
  timeClose?: number;             // Unix ms
  timeLimitMinutes?: number;      // minutes (0 = no limit)
  maxAttempts?: number;           // 0 = unlimited
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  showResultsImmediately?: boolean;
  visible?: boolean;
  password?: string;
  quizDraftItemId?: number;
};

export type UpdateQuizInput = {
  cmid: number;
  name?: string;
  intro?: string;
  timeOpen?: number;
  timeClose?: number;
  timeLimit?: number;
};
