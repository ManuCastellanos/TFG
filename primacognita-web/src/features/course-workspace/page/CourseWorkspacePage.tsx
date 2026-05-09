import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Banner } from '@/components/feedback/banner/Banner';
import { ProgressBanner } from '@/components/ui/ProgressBanner/ProgressBanner';
import { useSession } from '@/shared/hooks/useSession';
import { useCoursePageData } from '../hooks/useCoursePage';
import { useParticipants } from '../sections/participants/hooks/useParticipants';
import { ParticipantsView } from '../sections/participants/ParticipantsView';
import { TaskView } from '../sections/task/TaskView';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/RecentlyAccessedPanel';
import { useCourseCustomization, COLOR_META } from '@/shared/hooks/useCourseCustomization';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { CourseModule } from '@/modules/course/domain/CourseSection';
import { isTeacherRole } from '@/modules/user/domain/User';
import { UpcomingAssignmentsPanel } from '../components/UpcomingAssignmentsPanel';

import type { WorkspaceTab } from '../types/workspace.types';
import CourseSectionCard from '../components/CourseSectionCard';
import WorkspaceTabs from '../components/WorkspaceTabs';

export default function CoursePage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams({ strict: false }) as { id: string };

  const { token, userId, roleName } = useSession();
  const isTeacher = isTeacherRole(roleName);
  const { course, sections, exercises, loading, error, updateModuleCompletion } = useCoursePageData(courseId, userId, token);
  const { participants, loading: participantsLoading } = useParticipants(token, courseId);
  const { courseRepository } = useDependencies();

  const [tab, setTab] = useState<WorkspaceTab>('temario');
  const { emoji: courseEmoji, color: courseColor } = useCourseCustomization(courseId);
  const c = COLOR_META[courseColor];
  const { set: setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={() => navigate({ to: '/courses' })}
          className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white border border-(--border) text-(--fg-muted) hover:bg-(--tint-50) transition"
          aria-label="Volver a cursos"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className={`size-14 shrink-0 rounded-2xl ${c.soft} grid place-items-center text-4xl`}>{courseEmoji}</div>
        <h1 className="text-2xl font-extrabold text-(--fg) leading-tight truncate min-w-0">
          {course?.fullname ?? (loading ? '…' : 'Curso')}
        </h1>
      </div>,
    );
    return () => setPageHeader(null);
  }, [course?.fullname, courseEmoji, courseColor, isTeacher]);

  const handleToggleComplete = useCallback(
    async (module: CourseModule) => {
      if (!token) return;
      const currentState = module.completion?.state ?? 0;
      const nowCompleted = currentState < 1;
      updateModuleCompletion(module.cmid, nowCompleted);
      try {
        await courseRepository.markActivityComplete(token, module.cmid, nowCompleted);
      } catch {
        updateModuleCompletion(module.cmid, !nowCompleted);
      }
    },
    [token, courseRepository, updateModuleCompletion],
  );

  let nonGenIdx = 0;
  const enrichedSections = sections.map((section) => {
    const isGeneral = section.id === 0;
    const colorIdx = isGeneral ? -1 : nonGenIdx;
    const sectionNumber = isGeneral ? 0 : nonGenIdx + 1;
    if (!isGeneral) nonGenIdx++;

    const modulesWithCompletion = section.modules.filter((m) => m.completion?.hasCompletion);
    const progress =
      modulesWithCompletion.length > 0
        ? Math.round(
            (modulesWithCompletion.filter((m) => (m.completion?.state ?? 0) >= 1).length /
              modulesWithCompletion.length) *
              100,
          )
        : undefined;

    return { section, colorIdx, sectionNumber, progress };
  });

  const bannerProgress = course?.progress ?? 0;
  const bannerTotal = sections.reduce((t, s) => t + s.modules.length, 0);
  const bannerDone = Math.round((bannerProgress / 100) * bannerTotal);

  const handleModuleClick = (module: CourseModule) => {
    if (module.modName === 'quiz') {
      void navigate({
        to: '/courses/$courseId/quiz/$quizId',
        params: { courseId, quizId: String(module.cmid) },
      });
    } else {
      void navigate({
        to: '/courses/$courseId/assignment/$cmid',
        params: { courseId, cmid: String(module.cmid) },
      });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
      {error && <Banner variant="error">{error}</Banner>}

      {course && !isTeacher && (
        <ProgressBanner
          color={courseColor}
          label="Tu progreso del trimestre"
          progress={bannerProgress}
          subtitle={bannerTotal > 0 ? `${bannerDone} de ${bannerTotal} actividades` : undefined}
          stats={[
            { icon: '🏅', value: '—', label: 'Insignias' },
            { icon: '📈', value: '—', label: 'Puesto' },
          ]}
        />
      )}
      <WorkspaceTabs active={tab} onChange={setTab} isTeacher={isTeacher} />

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-3 min-w-0">
          {loading && <p className="text-sm text-(--fg-muted)">Cargando contenido...</p>}

          {!loading && tab === 'temario' && (
            <>
              {sections.length === 0 ? (
                <p className="text-sm text-(--fg-subtle)">Este curso aún no tiene temas.</p>
              ) : (
                enrichedSections.map(({ section, colorIdx, sectionNumber, progress }, idx) => (
                  <CourseSectionCard
                    key={section.id}
                    section={section}
                    sectionNumber={sectionNumber}
                    colorIdx={colorIdx}
                    defaultOpen={idx === 1}
                    progress={progress}
                    onModuleClick={handleModuleClick}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              )}
            </>
          )}

          {!loading && tab === 'ejercicios' && <TaskView exercises={exercises} onExerciseClick={handleModuleClick} />}

          {(tab === 'logros' || tab === 'anuncios') && (
            <div className="rounded-3xl border border-(--border) bg-white p-8 text-center">
              <div className="text-4xl mb-3">{tab === 'logros' ? '🏆' : '📣'}</div>
              <p className="font-bold text-(--fg)">Próximamente disponible</p>
              <p className="text-sm text-(--fg-muted) mt-1">Esta sección estará disponible en una próxima versión.</p>
            </div>
          )}

          {tab === 'companeros' && <ParticipantsView participants={participants} loading={participantsLoading} />}
        </div>

        <div className="flex flex-col gap-4">
          {!isTeacher && (
            <>
              <RecentlyAccessedPanel />
              <UpcomingAssignmentsPanel courseId={courseId} />
              <div className="bg-white rounded-3xl p-5 border border-(--border)">
                <h3 className="font-extrabold text-(--fg) mb-3">Tu profe</h3>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-linear-to-br from-emerald-300 to-emerald-500 grid place-items-center text-white font-extrabold text-sm">
                    PC
                  </div>
                  <div>
                    <div className="font-bold text-sm text-(--fg)">Profesor del curso</div>
                    <button type="button" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                      Enviar mensaje
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {isTeacher && course && (
            <div className="bg-white rounded-3xl p-5 border border-(--border)">
              <h3 className="font-extrabold text-(--fg) mb-3">Resumen de clase</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--fg-muted)">Avance medio</span>
                  <span className="font-extrabold text-emerald-700">{course.progress ?? 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-300 to-emerald-500"
                    style={{ width: `${course.progress ?? 0}%` }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-1 flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-4"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Añadir nuevo tema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
