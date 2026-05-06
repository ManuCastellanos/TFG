import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Banner } from '@/components/banner/Banner';
import { Button } from '@/components/button/Button';
import { Text } from '@/components/text/Text';
import { useSession } from '@/shared/hooks/useSession';
import { useCoursePageData } from '../hooks/useCoursePage';
import { useParticipants } from '../sections/participants/hooks/useParticipants';
import { CoursePageNav, type CoursePageSection } from './CoursePageNav';
import { TemarioView } from '../sections/outline/TemarioView';
import { TaskView } from '../sections/task/TaskView';
import { ParticipantsView } from '../sections/participants/ParticipantsView';
import { toProgressBarViewModel } from '../../courses/utils/course.utils';

export default function CoursePage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams({ strict: false }) as { id: string };

  const { token, userId } = useSession();
  const { course, sections, exercises, loading, error } = useCoursePageData(courseId, userId, token);
  const { participants, loading: participantsLoading } = useParticipants(token, courseId);

  const [activeSection, setActiveSection] = useState<CoursePageSection>('temario');

  return (
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
  );
}
