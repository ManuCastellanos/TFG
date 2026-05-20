import type { UseFormReturn } from 'react-hook-form';
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
  error: string | null;
  courseId: number;
  sectionNum: number;
  datetimeLocalToUnixMs: (value: string) => number | undefined;
};

export function AssignmentForm({
  form,
  onSubmit,
  error,
  courseId,
  sectionNum,
  datetimeLocalToUnixMs,
}: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = form;

  const submit = (values: CreateAssignmentFormValues) => {
    if (!values.allowFile && !values.allowText) return;

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
    <form id="assignment-form" onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      {error && <Alert variant="error">{error}</Alert>}

      <BasicInfoSection register={register} errors={errors} />
      <AvailabilitySection register={register} watch={watch} />
      <SubmissionTypesSection register={register} watch={watch} />
      <GradingSection register={register} />
      <SubmissionSettingsSection register={register} watch={watch} />
    </form>
  );
}
