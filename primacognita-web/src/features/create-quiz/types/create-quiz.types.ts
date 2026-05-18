export type CreateQuizFormValues = {
  name: string;
  intro: string;
  openDate: string;
  closeDate: string;
  timeLimitEnabled: boolean;
  timeLimitPreset: '15' | '30' | '45' | '60' | '90' | 'custom';
  timeLimitCustomMinutes: number;
  maxAttempts: '0' | '1' | '2' | '3';
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResultsImmediately: boolean;
  visible: boolean;
  password: string;
};
