import { Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/layouts/AppLayout';

export function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
