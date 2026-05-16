import { useMatches, useNavigate, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { TopBar } from './components/topbar/TopBar';
import { NAV_ITEMS } from './appLayout.constants';
import { useAppLayout } from './useAppLayout';
import { useLogout } from '@/features/session/hooks/useLogout';
import { getActiveHeader } from './getActiveHeader';
import { ChatDrawerProvider } from '@/features/chat/ChatDrawerProvider';
import { ChatModal } from '@/features/chat/components/ChatModal';
import { useChatDrawer } from '@/features/chat/useChatDrawer';
import { useUnreadCount } from '@/features/chat/hooks/useUnreadCount';
import { NotificationProvider } from '@/features/notifications/NotificationProvider';
import { NotificationDropdown } from '@/features/notifications/components/NotificationDropdown';
import { useNotificationDrawer } from '@/features/notifications/notificationContext';
import { useUnreadNotificationCount } from '@/features/notifications/hooks/useUnreadNotificationCount';

function AppHeader({ user }: { user: Parameters<typeof TopBar>[0]['user'] }) {
  const matches = useMatches();
  const HeaderComponent = getActiveHeader(matches);
  const { open: openChat } = useChatDrawer();
  const { data: unreadCount } = useUnreadCount();
  const { toggle: toggleNotifications } = useNotificationDrawer();
  const { data: unreadNotificationCount } = useUnreadNotificationCount();

  return (
    <header className="flex items-center gap-4 px-8 py-5 shrink-0">
      <div className="flex-1 min-w-0">{HeaderComponent ? <HeaderComponent /> : null}</div>
      <TopBar
        user={user}
        onMessageClick={openChat}
        onNotificationClick={toggleNotifications}
        unreadCount={unreadCount ?? 0}
        unreadNotificationCount={unreadNotificationCount ?? 0}
      />
    </header>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAppLayout();
  const { logout } = useLogout();

  return (
    <ChatDrawerProvider>
      <NotificationProvider>
        <div className="flex h-screen overflow-hidden bg-(--bg)">
          <Sidebar
            navItems={NAV_ITEMS}
            activePath={pathname}
            onNavigate={(path) => (path === '/logout' ? logout() : navigate({ to: path }))}
          />

          <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
            <AppHeader user={user} />
            {children}
          </div>
        </div>
        <ChatModal />
        <NotificationDropdown />
      </NotificationProvider>
    </ChatDrawerProvider>
  );
}
