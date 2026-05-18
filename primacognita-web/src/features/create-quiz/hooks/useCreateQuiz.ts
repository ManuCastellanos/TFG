import { useForm } from 'react-hook-form';
import type { CreateQuizFormValues } from '../types/create-quiz.types';

export const datetimeLocalToUnixMs = (value: string): number | undefined => {
  if (!value) return undefined;
  const ms = new Date(value).getTime();
  return isNaN(ms) ? undefined : ms;
};

export function useCreateQuiz() {
  const form = useForm<CreateQuizFormValues>({
    defaultValues: {
      name: '',
      intro: '',
      openDate: '',
      closeDate: '',
      timeLimitEnabled: false,
      timeLimitPreset: '30',
      timeLimitCustomMinutes: 30,
      maxAttempts: '0',
      shuffleQuestions: true,
      shuffleAnswers: true,
      showResultsImmediately: true,
      visible: true,
      password: '',
    },
  });

  return { form, datetimeLocalToUnixMs };
}
