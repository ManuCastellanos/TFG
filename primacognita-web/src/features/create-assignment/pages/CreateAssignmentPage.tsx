import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/hooks/queryKeys';
import { CreateAssignmentView } from './CreateAssignmentView';
import { useCreateAssignment } from '../hooks/useCreateAssignment';
import type { CreateAssignmentInput } from '@/modules/assignment/domain/CreateAssignmentInput';

export default function CreateAssignmentPage() {
  const { courseId, sectionNum } = useParams({ strict: false }) as {
    courseId: string;
    sectionNum: string;
  };
  const navigate = useNavigate();
  const { token } = useSession();
  const { assignmentRepository } = useDependencies();
  const queryClient = useQueryClient();
  const { form, datetimeLocalToUnixMs } = useCreateAssignment();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: CreateAssignmentInput) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await assignmentRepository.createAssignment(token, input);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.contents(courseId) });
      void navigate({ to: '/courses/$id', params: { id: courseId }, replace: true });
    } catch (err) {
      setError((err as Error).message ?? 'Error al crear la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    void navigate({ to: '/courses/$id', params: { id: courseId }, replace: true });
  };

  return (
    <CreateAssignmentView
      form={form}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
      error={error}
      courseId={Number(courseId)}
      sectionNum={Number(sectionNum)}
      datetimeLocalToUnixMs={datetimeLocalToUnixMs}
    />
  );
}
