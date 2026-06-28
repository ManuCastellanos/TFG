import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';
import { UpcomingAssignmentsPanel } from './UpcomingAssignmentsPanel';
import { TeacherCard } from './participants/components/TeacherCard';
import { isTeacherRole } from '@/modules/user/domain/User';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import type { Participant } from '@/modules/course/domain/Participant';
import type { WorkspaceTab } from '../../types/workspace.types';

type StudentSidebarProps = {
  activeTab: WorkspaceTab;
  participants: Participant[];
  participantsLoading: boolean;
  upcomingAssignments: UpcomingAssignment[];
  upcomingAssignmentsLoading: boolean;
  onUpcomingNavigate: (cmId: number) => void;
};

export const StudentSidebar = ({
  activeTab,
  participants,
  upcomingAssignments,
  upcomingAssignmentsLoading,
  onUpcomingNavigate,
}: StudentSidebarProps) => {
  const teacher = participants.find((p) => isTeacherRole(p.roleName));

  return (
    <div className="flex flex-col gap-4">
      {activeTab === 'temario' && <RecentlyAccessedPanel />}
      <UpcomingAssignmentsPanel upcoming={upcomingAssignments} loading={upcomingAssignmentsLoading} onNavigate={onUpcomingNavigate} />
      {activeTab === 'temario' && teacher && <TeacherCard teacher={teacher} />}
    </div>
  );
};
