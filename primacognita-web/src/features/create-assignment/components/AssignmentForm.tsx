import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { AvailabilitySection } from './sections/AvailabilitySection';
import { SubmissionTypesSection } from './sections/SubmissionTypesSection';
import { GradingSection } from './sections/GradingSection';
import { SubmissionSettingsSection } from './sections/SubmissionSettingsSection';
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

export function AssignmentForm({
  form,
  onSubmit,
  onCancel,
  isLoading,
  error,
  courseId,
  sectionNum,
  datetimeLocalToUnixMs,
}: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = form;

  const allowFile = watch('allowFile');
  const allowText = watch('allowText');

  const submit = (values: CreateAssignmentFormValues) => {
    if (!allowFile && !allowText) return;

    const dueMs = datetimeLocalToUnixMs(values.dueDate);
    const cutoffMs = values.cutoffSameAsDue
      ? dueMs
      : datetimeLocalToUnixMs(values.cutoffDate);

    const input: CreateAssignmentInput = {
      courseId,
      sectionNum,
      name: values.name,
      intro: values.intro || undefined,
      allowSubmissionsFromDate: datetimeLocalToUnixMs(values.allowSubmissionsFromDate),
      dueDate: dueMs,
      cutoffDate: cutoffMs,
      maxGrade: values.maxGrade,
      gradePass: values.gradePass !== '' ? Number(values.gradePass) : undefined,
      allowFile: values.allowFile,
      allowText: values.allowText,
      maxFileSubmissions: values.allowFile ? values.maxFileSubmissions : undefined,
      acceptedFileTypes: values.allowFile && values.acceptedFileTypes ? values.acceptedFileTypes : undefined,
      submissionDrafts: values.submissionDrafts,
      sendNotifications: values.sendNotifications,
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}

      <BasicInfoSection register={register} errors={errors} />
      <AvailabilitySection register={register} watch={watch} />
      <SubmissionTypesSection register={register} watch={watch} />
      <GradingSection register={register} />
      <SubmissionSettingsSection register={register} />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" size="md" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          disabled={isLoading || (!allowFile && !allowText)}
        >
          {isLoading ? 'Creando...' : 'Crear tarea'}
        </Button>
      </div>
    </form>
  );
}
