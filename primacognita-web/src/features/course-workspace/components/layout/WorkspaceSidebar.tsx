import type { WorkspaceCapabilities } from '../../utils/workspace-capabilities';
import { StudentSidebar } from '../../sections/student/StudentSidebar';
import { TeacherSidebar } from '../../sections/teacher/TeacherSidebar';
import { TeacherSidebarSkeleton } from '../../sections/teacher/TeacherSidebarSkeleton';
import type { Participant } from '@/modules/course/domain/Participant';
import type { TeacherStatsData } from '../../view-models/types';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import type { WorkspaceTab } from '../../types/workspace.types';

type WorkspaceSidebarProps = {
  caps: WorkspaceCapabilities;
  courseId: string;
  teacherStats: TeacherStatsData | null;
  participants: Participant[];
  participantsLoading: boolean;
  upcomingAssignments: UpcomingAssignment[];
  upcomingAssignmentsLoading: boolean;
  activeTab: WorkspaceTab;
  onUpcomingNavigate: (cmId: number) => void;
};

export const WorkspaceSidebar = ({
  caps,
  courseId,
  teacherStats,
  participants,
  participantsLoading,
  upcomingAssignments,
  upcomingAssignmentsLoading,
  activeTab,
  onUpcomingNavigate,
}: WorkspaceSidebarProps) => {
  if (caps.canViewSidebar) {
    return (
      <StudentSidebar
        activeTab={activeTab}
        participants={participants}
        participantsLoading={participantsLoading}
        upcomingAssignments={upcomingAssignments}
        upcomingAssignmentsLoading={upcomingAssignmentsLoading}
        onUpcomingNavigate={onUpcomingNavigate}
      />
    );
  }

  if (caps.canViewRoster) {
    if (participantsLoading) return <TeacherSidebarSkeleton />;
    return (
      <TeacherSidebar
        courseId={courseId}
        participants={participants}
        pendingItems={teacherStats?.pendingItems ?? []}
        progressByStudent={teacherStats?.progressByStudent ?? {}}
      />
    );
  }

  return null;
};
