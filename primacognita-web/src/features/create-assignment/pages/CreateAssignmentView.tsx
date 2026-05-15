import { Page } from '@/components/ui/page/Page';
import { AssignmentForm } from '../components/AssignmentForm';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateAssignmentFormValues } from '../types/create-assignment.types';
import type { CreateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';

type Props = {
  form: UseFormReturn<CreateAssignmentFormValues>;
  onSubmit: (input: CreateAssignmentInput) => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  courseId: number;
  sectionNum: number;
  datetimeLocalToUnixMs: (value: string) => number | undefined;
};

export function CreateAssignmentView({
  form,
  onSubmit,
  onCancel,
  isLoading,
  error,
  courseId,
  sectionNum,
  datetimeLocalToUnixMs,
}: Props) {
  return (
    <Page title="Nueva tarea">
      <div className="max-w-2xl flex flex-col gap-4">
        <AssignmentForm
          form={form}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          error={error}
          courseId={courseId}
          sectionNum={sectionNum}
          datetimeLocalToUnixMs={datetimeLocalToUnixMs}
        />
      </div>
    </Page>
  );
}
