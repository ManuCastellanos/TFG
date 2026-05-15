import { useForm } from 'react-hook-form';
import type { CreateAssignmentFormValues } from '../types/create-assignment.types';

const datetimeLocalToUnixMs = (value: string): number | undefined => {
  if (!value) return undefined;
  const ms = new Date(value).getTime();
  return isNaN(ms) ? undefined : ms;
};

export function useCreateAssignment() {
  const form = useForm<CreateAssignmentFormValues>({
    defaultValues: {
      name: '',
      intro: '',
      allowSubmissionsFromDate: '',
      dueDate: '',
      cutoffSameAsDue: false,
      cutoffDate: '',
      maxGrade: 10,
      gradePass: '',
      allowFile: true,
      allowText: false,
      maxFileSubmissions: 1,
      acceptedFileTypes: '',
      submissionDrafts: false,
      sendNotifications: false,
    },
  });

  return { form, datetimeLocalToUnixMs };
}
