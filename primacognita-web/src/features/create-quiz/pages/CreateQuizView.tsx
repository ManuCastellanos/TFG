import { Page } from '@/components/ui/page/Page';
import { QuizForm } from '../components/QuizForm';
import { QuizSidebar } from '../components/QuizSidebar';
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
    <Page>
      <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
        <QuizForm
          form={form}
          onSubmit={onSubmit}
          error={error}
          courseId={courseId}
          sectionNum={sectionNum}
        />
        <QuizSidebar
          form={form}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </div>
    </Page>
  );
}
