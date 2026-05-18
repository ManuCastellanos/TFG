import { Page } from '@/components/ui/page/Page';
import { QuizForm } from '../components/QuizForm';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateQuizFormValues } from '../types/create-quiz.types';
import type { CreateQuizInput } from '@/modules/quiz/domain/CreateQuizInput';

type Props = {
  form: UseFormReturn<CreateQuizFormValues>;
  onSubmit: (input: CreateQuizInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  courseId: number;
  sectionNum: number;
};

export function CreateQuizView({ form, onSubmit, onCancel, isLoading, error, courseId, sectionNum }: Props) {
  return (
    <Page title="Nuevo cuestionario">
      <div className="max-w-2xl flex flex-col gap-4">
        <QuizForm
          form={form}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          error={error}
          courseId={courseId}
          sectionNum={sectionNum}
        />
      </div>
    </Page>
  );
}
