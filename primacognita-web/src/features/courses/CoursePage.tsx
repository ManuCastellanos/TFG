import { useState } from 'react';
import { useNavigate, useParams, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, User, Calendar as CalendarIcon, BookOpen, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { Text } from '@/components/text/Text';
import { Sidebar } from '../dashboard/components/sidebar/Sidebar';
import { TopBar } from '../dashboard/components/topbar/TopBar';
import { useSession } from '@/shared/hooks/useSession';
import { useCurrentUser } from '../dashboard/hooks/useUser';
import { useCoursePageData } from './hooks/useCoursePageData';
import { useParticipants } from './hooks/useParticipants';
import { CoursePageNav, type CoursePageSection } from './coursePage/CoursePageNav';
import { TemarioView } from './coursePage/TemarioView';
import { TaskView } from './coursePage/TaskView';
import { ParticipantsView } from './coursePage/ParticipantsView';
import type { ProgressBarViewModel } from '@/components/progressBar/progressBar.types';
import type { Course } from '@/modules/course/domain/Course';
import type { NavItemConfig } from '@/components/navItem/navItem.types';

const clamp = (v: number) => Math.min(100, Math.max(0, v));

function toProgressBarViewModel(course: Course): ProgressBarViewModel {
  const progress = clamp(Math.round(course.progress ?? 0));
  const completed = course.completed;
  let message = '¡Empieza tu aventura! ✨';
  if (completed) message = '¡Curso completado! 🏆';
  else if (progress >= 75) message = '¡Casi lo tienes! 💪';
  else if (progress >= 40) message = '¡Vas genial! 🚀';
  else if (progress > 0) message = '¡Sigue así! 🌱';
  return { progress, completed, message };
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  { id: 'schedule', label: 'Horario', icon: CalendarIcon, path: '/schedule' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, path: '/courses' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/settings' },
  { id: 'logout', label: 'Cerrar sesión', icon: LogOut, path: '/logout' },
];

export default function CoursePage() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { id: courseId } = useParams({ strict: false }) as { id: string };

  const { token, userId } = useSession();
  const { user } = useCurrentUser();
  const { course, sections, exercises, loading, error } = useCoursePageData(courseId, userId, token);
  const { participants, loading: participantsLoading } = useParticipants(token, courseId);

  const [activeSection, setActiveSection] = useState<CoursePageSection>('temario');

  return (
    <div className="flex h-screen overflow-hidden bg-(--surface)">
      <Sidebar navItems={NAV_ITEMS} activePath={pathname} onNavigate={(path) => navigate({ to: path })} />

      <main className="flex flex-1 flex-col overflow-y-auto p-8">
        <div className="mb-6 flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="p-2"
            onClick={() => navigate({ to: '/courses' })}
            aria-label="Volver a cursos"
          >
            <ArrowLeft className="size-5" />
          </Button>

          <div className="flex items-baseline gap-2">
            <span aria-hidden className="text-2xl">
              📘
            </span>
            <Text className="text-2xl font-bold text-(--fg)">
              {course?.fullname ?? (loading ? 'Cargando...' : 'Curso')}
            </Text>
          </div>
        </div>

        {error && <Banner variant="error">{error}</Banner>}

        <div className="mb-8">
          <CoursePageNav active={activeSection} onChange={setActiveSection} />
        </div>

        {loading && !error && activeSection !== 'participantes' && (
          <Text className="text-(--muted)">Cargando contenido del curso...</Text>
        )}

        {!loading && !error && activeSection === 'temario' && (
          <section className="flex flex-col gap-4">
            <TemarioView
              sections={sections}
              progressViewModel={course ? toProgressBarViewModel(course) : undefined}
              onModuleClick={(module) =>
                navigate({
                  to: '/courses/$courseId/exercise/$modName/$cmid',
                  params: { courseId, modName: module.modName, cmid: String(module.cmid) },
                })
              }
            />
          </section>
        )}

        {!loading && !error && activeSection === 'ejercicios' && (
          <section className="flex flex-col gap-4">
            <TaskView
              exercises={exercises}
              onExerciseClick={(module) =>
                navigate({
                  to: '/courses/$courseId/exercise/$modName/$cmid',
                  params: { courseId, modName: module.modName, cmid: String(module.cmid) },
                })
              }
            />
          </section>
        )}

        {activeSection === 'calificaciones' && (
          <section className="flex flex-col gap-4">
            <Text className="text-(--fg-muted)">Próximamente disponible.</Text>
          </section>
        )}

        {activeSection === 'participantes' && (
          <section className="flex flex-col gap-4">
            <ParticipantsView participants={participants} loading={participantsLoading} />
          </section>
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
