import { useNavigate, useParams, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  User,
  Calendar as CalendarIcon,
  BookOpen,
  Settings,
  LogOut,
  ArrowLeft,
  CalendarClock,
  Trophy,
} from 'lucide-react';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { Text } from '@/components/text/Text';
import { Card } from '@/components/card/Card';
import { Sidebar } from '../dashboard/components/sidebar/Sidebar';
import { TopBar } from '../dashboard/components/topbar/TopBar';
import { useCurrentUser } from '../dashboard/hooks/useUser';
import { useTask } from './hooks/useTask';
import type { NavItemConfig } from '@/components/navItem/navItem.types';

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  { id: 'schedule', label: 'Horario', icon: CalendarIcon, path: '/schedule' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, path: '/courses' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, path: '/logout' },
];

const formatDate = (date: Date) =>
  date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatGrade = (value: number) =>
  value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TaskPage() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { courseId, modName, cmid } = useParams({ strict: false }) as {
    courseId: string;
    modName: string;
    cmid: string;
  };

  const { user } = useCurrentUser();
  const { task, loading, error } = useTask(courseId, modName, cmid);

  const isQuiz = modName === 'quiz';

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar
        navItems={NAV_ITEMS}
        activePath={pathname}
        onNavigate={(path) => navigate({ to: path })}
      />

      <main className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="mb-6 flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="p-2"
            onClick={() => navigate({ to: '/courses/$id', params: { id: courseId } })}
            aria-label="Volver al curso"
          >
            <ArrowLeft className="size-5" />
          </Button>

          <Text className="text-2xl font-bold text-(--fg)">
            {task?.title ?? (loading ? 'Cargando...' : 'Ejercicio')}
          </Text>
        </div>

        {error && <Banner variant="error">{error}</Banner>}

        {!loading && task && (
          <div className="flex max-w-2xl flex-col gap-6">
            <Card className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--fg-muted)">
                <CalendarClock className="size-4" />
                <span>Requisitos de finalización</span>
              </div>

              <div className="flex flex-col gap-2 text-sm text-(--fg)">
                {task.openDate && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Abrió:</span>
                    <span className="capitalize">{formatDate(task.openDate)}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Cierra:</span>
                    <span className="capitalize">{formatDate(task.dueDate)}</span>
                  </div>
                )}
                {!task.openDate && !task.dueDate && (
                  <span className="text-(--fg-muted)">Sin fechas límite establecidas.</span>
                )}
              </div>
            </Card>

            <Button
              type="button"
              variant="primary"
              onClick={() => window.open(task.viewUrl, '_blank')}
            >
              {isQuiz ? 'Intento cuestionario' : 'Entregar tarea'}
            </Button>

            <Card className="flex flex-col gap-3 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-(--fg-muted)">
                <Trophy className="size-4" />
                <span>Calificación</span>
              </div>

              <div className="flex flex-col gap-1.5 text-sm text-(--fg)">
                {isQuiz && task.gradingMethod && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Método de calificación:</span>
                    <span>{task.gradingMethod}</span>
                  </div>
                )}
                {task.gradePass != null && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Calificación para aprobar:</span>
                    <span>
                      {formatGrade(task.gradePass)} de {formatGrade(task.gradeMax)}
                    </span>
                  </div>
                )}
                {task.gradePass == null && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Calificación máxima:</span>
                    <span>{formatGrade(task.gradeMax)}</span>
                  </div>
                )}
                {task.status.graded && task.status.grade != null && (
                  <div className="flex gap-2">
                    <span className="font-medium text-(--fg-muted)">Tu calificación:</span>
                    <span className="font-semibold text-(--color-pr)">
                      {formatGrade(task.status.grade)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
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
