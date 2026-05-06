import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { TopBar } from './components/topbar/TopBar';
import { NAV_ITEMS } from './appLayout.constants';
import { useAppLayout } from './useAppLayout';
import { useLogout } from '@/features/session/hooks/useLogout';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel: ReactNode;
}

export function AppLayout({ children, rightPanel }: AppLayoutProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAppLayout();
  const { logout } = useLogout();

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar
        navItems={NAV_ITEMS}
        activePath={pathname}
        onNavigate={(path) => path === '/logout' ? logout() : navigate({ to: path })}
      />

      {children}

      {rightPanel && (
        <div className="flex w-85 shrink-0 flex-col gap-4 overflow-y-auto bg-(--panel) p-6">
          <TopBar user={user} />
          {rightPanel}
        </div>
      )}
    </div>
  );
}