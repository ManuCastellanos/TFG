import { useCallback, useEffect, useState } from 'react';
import type { Participant } from '@/modules/course/domain/Participant';
import { useDependencies } from '@/shared/providers/DependenciesProvider';

type UseParticipantsResult = {
  participants: Participant[];
  loading: boolean;
  error: string | null;
};

export const useParticipants = (token: string | null, courseId: string | null): UseParticipantsResult => {
  const { courseRepository } = useDependencies();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    if (!token || !courseId) {
      setParticipants([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await courseRepository.getEnrolledUsers(token, courseId);
      setParticipants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [courseRepository, token, courseId]);

  useEffect(() => {
    void fetchParticipants();
  }, [fetchParticipants]);

  return { participants, loading, error };
};
