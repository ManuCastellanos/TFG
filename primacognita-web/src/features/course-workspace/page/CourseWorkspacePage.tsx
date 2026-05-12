import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import { AvatarBox } from '@/components/ui/avatarBox/AvatarBox';
import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import { Page } from '@/components/ui/page/Page';
import { ProgressBanner } from '@/components/ui/ProgressBanner/ProgressBanner';
import { useSession } from '@/shared/hooks/useSession';
import { useCoursePageData } from '../hooks/useCoursePage';
import { useParticipants } from '../sections/participants/hooks/useParticipants';
import { useTeacherStats } from '../hooks/useTeacherStats';
import { ParticipantsView } from '../sections/participants/ParticipantsView';
import { TaskView } from '../sections/task/TaskView';

import { useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import { COLOR_META } from '@/shared/theme/courseColors';
import { usePageHeader } from '@/layouts/pageHeader.context';
import { useDependencies } from '@/shared/providers/DependenciesProvider';
import type { CourseModule } from '@/modules/course/domain/CourseSection';
import { isTeacherRole } from '@/modules/user/domain/User';
import { UpcomingAssignmentsPanel } from '../components/UpcomingAssignmentsPanel';
import { TeacherStatsBar } from '../components/teacher/TeacherStatsBar';
import { TeacherPendingPanel } from '../components/teacher/TeacherPendingPanel';
import { TeacherClassRoster } from '../components/teacher/TeacherClassRoster';

import type { WorkspaceTab } from '../types/workspace.types';
import CourseSectionCard from '../components/CourseSectionCard';
import WorkspaceTabs from '../components/WorkspaceTabs';
import { RecentlyAccessedPanel } from '@/features/recently-accessed/components/RecentlyAccessedPanel';

export default function CoursePage() {
  const navigate = useNavigate();
  const { id: courseId } = useParams({ strict: false }) as { id: string };

  const { token, userId, roleName } = useSession();
  const isTeacher = isTeacherRole(roleName);
  const { course, sections, exercises, loading, error, updateModuleCompletion } = useCoursePageData(
    courseId,
    userId,
    token,
  );
  const { participants, loading: participantsLoading } = useParticipants(token, courseId);
  const teacherStats = useTeacherStats(isTeacher ? token : null, courseId, sections, participants);
  const { courseRepository } = useDependencies();

  const [tab, setTab] = useState<WorkspaceTab>('temario');
  const { emoji: courseEmoji, color: courseColor } = useCourseCustomization(courseId);
  const c = COLOR_META[courseColor];
  const { set: setPageHeader } = usePageHeader();

  useEffect(() => {
    setPageHeader(
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => navigate({ to: '/courses' })}
          aria-label="Volver a cursos"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className={`size-14 shrink-0 rounded-2xl ${c.soft} grid place-items-center text-4xl`}>{courseEmoji}</div>
          <h1 className="text-2xl font-semibold text-(--fg) leading-tight truncate min-w-0">
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

  const nonGeneralSections = sections.filter((s) => s.id !== 0);
  const avgProgress =
    nonGeneralSections.length > 0
      ? Math.round(
          nonGeneralSections.reduce((sum, s) => sum + (teacherStats.sectionProgress[s.id] ?? 0), 0) /
            nonGeneralSections.length,
        )
      : 0;

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
    <Page>
      {error && <Alert variant="error">{error}</Alert>}

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

      {isTeacher && (
        <TeacherStatsBar
          studentsCount={teacherStats.studentsCount}
          activeCount={teacherStats.activeCount}
          avgProgress={avgProgress}
          pendingTotal={teacherStats.pendingTotal}
        />
      )}

      <WorkspaceTabs active={tab} onChange={setTab} isTeacher={isTeacher} />

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-3 min-w-0">
          {loading && <p className="text-sm text-(--fg-muted)">Cargando contenido…</p>}

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
                    onToggleComplete={isTeacher ? undefined : handleToggleComplete}
                    pendingByModule={isTeacher ? teacherStats.pendingByModule : undefined}
                    teacherSectionProgress={isTeacher ? teacherStats.sectionProgress[section.id] : undefined}
                  />
                ))
              )}
            </>
          )}

          {!loading && tab === 'ejercicios' && <TaskView exercises={exercises} onExerciseClick={handleModuleClick} />}

          {(tab === 'logros' || tab === 'anuncios') && (
            <EmptyState
              emoji={tab === 'logros' ? '🏆' : '📣'}
              title="Próximamente disponible"
              subtitle="Esta sección estará disponible en una próxima versión."
            />
          )}

          {tab === 'companeros' && <ParticipantsView participants={participants} loading={participantsLoading} />}
        </div>

        <div className="flex flex-col gap-4">
          {!isTeacher && (
            <>
              <RecentlyAccessedPanel />
              <UpcomingAssignmentsPanel courseId={courseId} />
              <div className="bg-white rounded-3xl p-5 border border-(--border)">
                <h3 className="font-semibold text-(--fg) mb-3">Tu profe</h3>
                <div className="flex items-center gap-3">
                  <AvatarBox gradient="emerald" size="size-12" className="text-sm">
                    PC
                  </AvatarBox>
                  <div>
                    <div className="font-bold text-sm text-(--fg)">Profesor del curso</div>
                    <Button variant="success" size="sm" type="button">
                      Enviar mensaje
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {isTeacher && (
            <>
              <TeacherPendingPanel courseId={courseId} items={teacherStats.pendingItems} />
              <TeacherClassRoster
                participants={participants}
                progressByStudent={teacherStats.progressByStudent}
              />
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
