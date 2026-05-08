import { useCallback, useEffect, useState } from 'react';
import type { Assignment } from '@/modules/assignment/domain/Assignment';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseAssignmentResult = {
  assignment: Assignment | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useAssignment(courseId: string | null, cmid: string | null): UseAssignmentResult {
  const { assignmentRepository } = useDependencies();
  const { token, userId } = useSession();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignment = useCallback(async () => {
    if (!token || !courseId || !cmid || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await assignmentRepository.getAssignment(
        token,
        Number(courseId),
        Number(cmid),
        Number(userId),
      );
      if (!data) {
        setError('Tarea no encontrada.');
        return;
      }
      setAssignment(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar la tarea.');
    } finally {
      setLoading(false);
    }
  }, [assignmentRepository, token, userId, courseId, cmid]);

  useEffect(() => {
    void fetchAssignment();
  }, [fetchAssignment]);

  return { assignment, loading, error, refetch: fetchAssignment };
}
