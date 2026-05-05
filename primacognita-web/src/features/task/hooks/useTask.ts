import { useCallback, useEffect, useState } from 'react';
import type { Task } from '@/modules/task/domain/Task';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type UseTaskResult = {
  task: Task | null;
  loading: boolean;
  error: string | null;
};

export const useTask = (
  courseId: string | null,
  modName: string | null,
  cmid: string | null,
): UseTaskResult => {
  const { taskRepository } = useDependencies();
  const { token, userId } = useSession();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!token || !courseId || !cmid || !modName) return;

    setLoading(true);
    setError(null);

    try {
      const data = await taskRepository.getTaskByCmid(
        token,
        Number(courseId),
        Number(cmid),
        modName,
      );

      if (!data) {
        setError('Ejercicio no encontrado.');
        return;
      }

      if (modName === 'assign' && userId) {
        data.status = await taskRepository.getSubmissionStatus(token, data.id, Number(userId));
        void taskRepository.viewAssign(token, data.id);
      }

      setTask(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el ejercicio.');
    } finally {
      setLoading(false);
    }
  }, [taskRepository, token, userId, courseId, modName, cmid]);

  useEffect(() => {
    void fetchTask();
  }, [fetchTask]);

  return { task, loading, error };
};
