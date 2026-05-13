import { TeacherPendingPanel } from './TeacherPendingPanel';
import { TeacherClassRoster } from './TeacherClassRoster';
import type { Participant } from '@/modules/course/domain/Participant';
import type { PendingItem } from '../../view-models/types';

type TeacherSidebarProps = {
  courseId: string;
  participants: Participant[];
  pendingItems: PendingItem[];
  progressByStudent: Record<string, number>;
};

export const TeacherSidebar = ({ courseId, participants, pendingItems, progressByStudent }: TeacherSidebarProps) => (
  <div className="flex flex-col gap-4">
    <TeacherPendingPanel courseId={courseId} items={pendingItems} />
    <TeacherClassRoster participants={participants} progressByStudent={progressByStudent} />
  </div>
);
