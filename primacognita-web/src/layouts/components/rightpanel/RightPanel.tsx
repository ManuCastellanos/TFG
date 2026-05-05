import { CalendarWidget } from '@/features/calendar/CalendarWidget';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';

export function RightPanel() {
  return (
    <>
      <CalendarWidget />
      <RecentlyAccessedPanel />
    </>
  );
}
