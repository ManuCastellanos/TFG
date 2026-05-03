import { useEffect, useRef, useState } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, User, Calendar as CalendarIcon, BookOpen, Settings, LogOut, Plus } from 'lucide-react';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { Text } from '@/components/text/Text';
import { Sidebar } from '../dashboard/components/sidebar/Sidebar';
import { TopBar } from '../dashboard/components/topbar/TopBar';
import { CoursesList } from './CoursesList';
import { useSession } from '@/shared/hooks/useSession';
import { useCurrentUser } from '../dashboard/hooks/useUser';
import { useUserCourses } from './hooks/useUserCourses';
import { isTeacherRole } from '@/modules/user/domain/User';
import type { NavItemConfig } from '@/components/navItem/navItem.types';

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  { id: 'schedule', label: 'Horario', icon: CalendarIcon, path: '/schedule' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, path: '/courses' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, path: '/logout' },
];

export default function Courses() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { token, userId } = useSession();
  const { user } = useCurrentUser();
  const { courses, loading, error } = useUserCourses(userId, token);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar navItems={NAV_ITEMS} activePath={pathname} onNavigate={(path) => navigate({ to: path })} />

      <main className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <Text className="text-2xl font-bold text-(--fg)">Mis Cursos</Text>

          {isTeacherRole(user?.roleName) && (
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="ghost"
                className="p-2"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-label="Opciones de curso"
              >
                <Plus className="size-5" />
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-10 mt-1 min-w-40 overflow-hidden rounded-xl border border-(--border) bg-(--surface) shadow-(--shadow-md)">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate({ to: '/courses/new' });
                    }}
                  >
                    Crear curso
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-(--fg) transition-colors hover:bg-(--surface-muted)"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate({ to: '/courses/manage' });
                    }}
                  >
                    Gestionar cursos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && <Banner variant="error">{error}</Banner>}

        {loading && <Text className="text-(--muted)">Cargando cursos...</Text>}

        {!loading && !error && (
          <CoursesList
            courses={courses}
            onCourseClick={(id) => navigate({ to: '/courses/$id', params: { id } })}
            showHeader={false}
          />
        )}
      </main>

      <div className="flex w-85 shrink-0 flex-col gap-4 overflow-y-auto bg-(--panel) p-6">
        <TopBar
          user={{
            name: user?.firstName ?? '',
            handle: user?.username ?? '',
            avatarUrl: user?.avatarUrl ?? null,
          }}
        />
      </div>
    </div>
  );
}
