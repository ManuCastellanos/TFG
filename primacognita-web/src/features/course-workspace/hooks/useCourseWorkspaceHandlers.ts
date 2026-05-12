import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { CourseModule } from '@/modules/course/domain/CourseSection';

type Handlers = {
  handleModuleClick: (module: CourseModule) => void;
  handleUpcomingAssignmentClick: (cmId: number) => void;
  handleToggleComplete: (module: CourseModule) => Promise<void>;
};

export function useCourseWorkspaceHandlers(
  courseId: string,
  token: string | null,
  updateModuleCompletion: (cmid: number, completed: boolean) => void,
  markActivityComplete: (token: string, cmid: number, completed: boolean) => Promise<void>,
): Handlers {
  const navigate = useNavigate();

  const handleModuleClick = useCallback(
    (module: CourseModule) => {
      if (module.modName === 'quiz') {
        void navigate({ to: '/courses/$courseId/quiz/$quizId', params: { courseId, quizId: String(module.cmid) } });
      } else {
        void navigate({ to: '/courses/$courseId/assignment/$cmid', params: { courseId, cmid: String(module.cmid) } });
      }
    },
    [navigate, courseId],
  );

  const handleUpcomingAssignmentClick = useCallback(
    (cmId: number) => {
      void navigate({ to: '/courses/$courseId/assignment/$cmid', params: { courseId, cmid: String(cmId) } });
    },
    [navigate, courseId],
  );

  const handleToggleComplete = useCallback(
    async (module: CourseModule) => {
      if (!token) return;
      const currentState = module.completion?.state ?? 0;
      const nowCompleted = currentState < 1;
      updateModuleCompletion(module.cmid, nowCompleted);
      try {
        await markActivityComplete(token, module.cmid, nowCompleted);
      } catch {
        updateModuleCompletion(module.cmid, !nowCompleted);
      }
    },
    [token, updateModuleCompletion, markActivityComplete],
  );

  return { handleModuleClick, handleUpcomingAssignmentClick, handleToggleComplete };
}
