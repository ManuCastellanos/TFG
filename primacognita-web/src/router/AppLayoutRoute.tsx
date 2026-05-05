import { Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/layouts/AppLayout';
import { RightPanel } from '../layouts/components/rightpanel/RightPanel';

export function AppLayoutRoute() {
  return (
    <AppLayout rightPanel={<RightPanel />}>
      <Outlet />
    </AppLayout>
  );
}
