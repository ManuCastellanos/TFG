import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { AvailabilitySection } from './sections/AvailabilitySection';
import { TimingSection } from './sections/TimingSection';
import { AttemptsSection } from './sections/AttemptsSection';
import { BehaviourSection } from './sections/BehaviourSection';
import { AccessSection } from './sections/AccessSection';
import type { CreateQuizFormValues } from '../types/create-quiz.types';
import type { CreateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';
import { datetimeLocalToUnixMs } from '../hooks/useCreateQuiz';

type Props = {
  form: UseFormReturn<CreateQuizFormValues>;
  onSubmit: (input: CreateQuizInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  courseId: number;
  sectionNum: number;
};

export function QuizForm({ form, onSubmit, onCancel, isLoading, error, courseId, sectionNum }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const submit = (values: CreateQuizFormValues) => {
    const timeLimitMinutes = values.timeLimitEnabled
      ? (values.timeLimitPreset === 'custom'
        ? values.timeLimitCustomMinutes
        : Number(values.timeLimitPreset))
      : undefined;

    const input: CreateQuizInput = {
      courseId,
      sectionNum,
      name: values.name,
      intro: values.intro || undefined,
      timeOpen: datetimeLocalToUnixMs(values.openDate),
      timeClose: datetimeLocalToUnixMs(values.closeDate),
      timeLimitMinutes,
      maxAttempts: Number(values.maxAttempts),
      shuffleQuestions: values.shuffleQuestions,
      shuffleAnswers: values.shuffleAnswers,
      showResultsImmediately: values.showResultsImmediately,
      visible: values.visible,
      password: values.password || undefined,
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}

      <BasicInfoSection register={register} errors={errors} />
      <AvailabilitySection register={register} />
      <TimingSection register={register} watch={watch} setValue={setValue} />
      <AttemptsSection register={register} />
      <BehaviourSection register={register} />
      <AccessSection register={register} />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" size="md" type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : 'Crear cuestionario'}
        </Button>
      </div>
    </form>
  );
}
