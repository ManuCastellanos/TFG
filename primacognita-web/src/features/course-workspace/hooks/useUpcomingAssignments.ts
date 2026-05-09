import { useEffect, useState } from 'react';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import { useSession } from '@/shared/hooks/useSession';

type Result = {
  upcoming: UpcomingAssignment[];
  loading: boolean;
};

export function useUpcomingAssignments(courseId: string): Result {
  const { assignmentRepository } = useDependencies();
  const { token, userId } = useSession();

  const [upcoming, setUpcoming] = useState<UpcomingAssignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !userId || !courseId) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const result = await assignmentRepository.getUpcomingAssignments(
          token,
          Number(courseId),
          Number(userId),
        );
        if (!cancelled) setUpcoming(result);
      } catch {
        // silently ignore — widget is non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetch();
    return () => { cancelled = true; };
  }, [assignmentRepository, token, userId, courseId]);

  return { upcoming, loading };
}
