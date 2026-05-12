import type { WorkspaceCapabilities } from '../../utils/workspace-capabilities';
import { StudentSidebar } from '../student/StudentSidebar';
import { TeacherSidebar } from '../teacher/TeacherSidebar';
import type { Participant } from '@/modules/course/domain/Participant';
import type { TeacherStatsData } from '../../view-models/types';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';

type WorkspaceSidebarProps = {
  caps: WorkspaceCapabilities;
  courseId: string;
  teacherStats: TeacherStatsData | null;
  participants: Participant[];
  upcomingAssignments: UpcomingAssignment[];
  upcomingAssignmentsLoading: boolean;
  onUpcomingNavigate: (cmId: number) => void;
};

export const WorkspaceSidebar = ({ caps, courseId, teacherStats, participants, upcomingAssignments, upcomingAssignmentsLoading, onUpcomingNavigate }: WorkspaceSidebarProps) => {
  if (caps.canViewSidebar) {
    return (
      <StudentSidebar
        upcomingAssignments={upcomingAssignments}
        upcomingAssignmentsLoading={upcomingAssignmentsLoading}
        onUpcomingNavigate={onUpcomingNavigate}
      />
    );
  }

  if (caps.canViewRoster) {
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
