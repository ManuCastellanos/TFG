import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { Button } from '@/components/ui/button/Button';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';
import { UpcomingAssignmentsPanel } from './UpcomingAssignmentsPanel';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';

type StudentSidebarProps = {
  upcomingAssignments: UpcomingAssignment[];
  upcomingAssignmentsLoading: boolean;
  onUpcomingNavigate: (cmId: number) => void;
};

export const StudentSidebar = ({ upcomingAssignments, upcomingAssignmentsLoading, onUpcomingNavigate }: StudentSidebarProps) => (
  <div className="flex flex-col gap-4">
    <RecentlyAccessedPanel />
    <UpcomingAssignmentsPanel upcoming={upcomingAssignments} loading={upcomingAssignmentsLoading} onNavigate={onUpcomingNavigate} />
    <div className="bg-white rounded-3xl p-5 border border-(--border)">
      <h3 className="font-semibold text-(--fg) mb-3">Tu profe</h3>
      <div className="flex items-center gap-3">
        <AvatarBox gradient="emerald" size="size-12" className="text-sm">
          PC
        </AvatarBox>
        <div>
          <div className="font-bold text-sm text-(--fg)">Profesor del curso</div>
          <Button variant="success" size="sm" type="button">
            Enviar mensaje
          </Button>
        </div>
      </div>
    </div>
  </div>
);
