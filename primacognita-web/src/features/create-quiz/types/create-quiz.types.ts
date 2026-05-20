export type CreateQuizFormValues = {
  name: string;
  intro: string;
  openDate: string;
  closeDate: string;
  timeLimitEnabled: boolean;
  timeLimitCustomMinutes: number;
  maxAttempts: '0' | '1' | '2' | '3';
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResultsImmediately: boolean;
  visible: boolean;
  password: string;
};
