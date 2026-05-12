import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { COLOR_META, type CourseColor } from '@/shared/theme/courseColors';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { WorkspaceHeader } from '../components/layout/WorkspaceHeader';

export function useCourseWorkspaceHeader(title: string | null | undefined, emoji: string, courseColor: CourseColor) {
  const navigate = useNavigate();
  const { set: setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader(
      <WorkspaceHeader
        title={title}
        emoji={emoji}
        colorSoft={COLOR_META[courseColor].soft}
        onBack={() => navigate({ to: '/courses' })}
      />,
    );
    return () => setPageHeader(null);
  }, [title, emoji, courseColor, navigate, setPageHeader]);
}
