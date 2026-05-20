import { Page } from '@/components/ui/page/Page';
import { AssignmentForm } from '../components/AssignmentForm';
import { AssignmentSidebar } from '../components/AssignmentSidebar';
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
  const allowFile = form.watch('allowFile');
  const allowText = form.watch('allowText');

  return (
    <Page>
      <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
        <AssignmentForm
          form={form}
          onSubmit={onSubmit}
          error={error}
          courseId={courseId}
          sectionNum={sectionNum}
          datetimeLocalToUnixMs={datetimeLocalToUnixMs}
        />
        <AssignmentSidebar
          form={form}
          onCancel={onCancel}
          isLoading={isLoading}
          allowSubmit={allowFile || allowText}
        />
      </div>
    </Page>
  );
}
