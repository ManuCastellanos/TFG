import { useMemo } from 'react';
import { LayoutDashboard, User, Calendar as CalendarIcon, BookOpen, Settings, LogOut } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Sidebar } from '@/features/dashboard/components/sidebar/Sidebar';
import { TopBar } from '@/features/dashboard/components/topbar/TopBar';
import { CalendarWidget } from '@/features/dashboard/components/widgets/CalendarWidget';
import { ScheduleSection } from '@/features/dashboard/components/schedule/ScheduleSection';
import { useCurrentUser } from '@/features/dashboard/hooks/useUser';
import { useMonthCursor } from '@/features/dashboard/hooks/useMonthCursor';
import { useCalendar } from '@/features/dashboard/hooks/useCalendar';
import { useRecentlyAccessedItems } from '@/features/dashboard/hooks/useRecentlyAccessedItems';
import { useSession } from '@/shared/hooks/useSession';
import { Card } from '@/components/card/Card';
import { SectionHeader } from '@/components/sectionHeader/SectionHeader';
import type { NavItemConfig } from '@/components/navItem/navItem.types';
import type { ScheduleEntry } from '@/features/dashboard/components/schedule/schedule.types';
import type { RecentItem } from '@/modules/recentlyAccessed/domain/RecentItem';

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  { id: 'schedule', label: 'Horario', icon: CalendarIcon, path: '/schedule' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, path: '/courses' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, path: '/logout' },
];

const SCHEDULE_COLORS = [
  'bg-orange-500',
  'bg-violet-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-teal-500',
] as const;

const MOD_COLORS: Record<string, string> = {
  resource: 'bg-blue-500',
  quiz: 'bg-orange-500',
  assign: 'bg-violet-500',
  forum: 'bg-teal-500',
  page: 'bg-amber-500',
  url: 'bg-green-500',
};

const toScheduleEntry = (item: RecentItem, i: number): ScheduleEntry => ({
  id: item.id,
  code: item.modName.slice(0, 2).toUpperCase(),
  accentColor: MOD_COLORS[item.modName] ?? SCHEDULE_COLORS[i % SCHEDULE_COLORS.length],
  title: item.name,
  time: new Date(item.timeAccess * 1000).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  }),
  subtitle: item.courseName,
  viewUrl: item.viewUrl || null,
});

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { token } = useSession();
  const { user } = useCurrentUser();

  const { cursor, goPrevMonth, goNextMonth } = useMonthCursor();
  const { viewModel: calendarViewModel } = useCalendar(token, cursor);
  const { items: recentItems } = useRecentlyAccessedItems(token);

  const scheduleItems = useMemo<ScheduleEntry[]>(
    () => recentItems.map(toScheduleEntry),
    [recentItems],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar navItems={NAV_ITEMS} activePath={pathname} onNavigate={(path) => navigate({ to: path })} />

      {children}

      <div className="flex w-85 shrink-0 flex-col gap-4 overflow-y-auto bg-(--panel) p-6">
        <TopBar
          user={{
            name: user?.firstName ?? '',
            handle: user?.username ?? '',
            avatarUrl: user?.avatarUrl ?? null,
          }}
        />
        <CalendarWidget viewModel={calendarViewModel} onPrev={goPrevMonth} onNext={goNextMonth} />
        <section className="flex flex-col gap-3">
          <SectionHeader title="Sigue por aquí" />
          <Card className="p-4">
            <ScheduleSection
              items={scheduleItems}
              onItemClick={(id) => {
                const entry = scheduleItems.find((i) => i.id === id);
                if (entry?.viewUrl) window.open(entry.viewUrl, '_blank');
              }}
            />
          </Card>
        </section>
      </div>
    </div>
  );
}
