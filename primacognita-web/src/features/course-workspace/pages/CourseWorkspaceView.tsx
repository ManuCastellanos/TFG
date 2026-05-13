import { useState } from 'react';
import type { Course } from '@/modules/course/domain/Course';
import type { CourseModule } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { UpcomingAssignment } from '@/modules/assignment/domain/UpcomingAssignment';
import type { TeacherStatsData } from '../view-models/types';
import type { CourseWorkspaceViewModel } from '../view-models/types';
import type { WorkspaceTab as WorkspaceTabType } from '../types/workspace.types';
import type { CourseColor } from '@/shared/theme/courseColors';
import { ProgressBanner } from '@/components/ui/ProgressBanner/ProgressBanner';
import { TeacherStatsBar } from '../sections/teacher/TeacherStatsBar';
import WorkspaceTabs from '../components/layout/WorkspaceTabs';
import { WorkspaceLayout } from '../components/layout/WorkspaceLayout';
import { WorkspaceContent } from '../components/layout/WorkspaceContent';
import { WorkspaceSidebar } from '../components/layout/WorkspaceSidebar';

type CourseWorkspaceViewProps = {
  viewModel: CourseWorkspaceViewModel;
  course: Course | null;
  exercises: CourseModule[];
  loading: boolean;
  participants: Participant[];
  participantsLoading: boolean;
  teacherStats: TeacherStatsData;
  upcomingAssignments: UpcomingAssignment[];
  upcomingAssignmentsLoading: boolean;
  courseColor: CourseColor;
  courseId: string;
  onModuleClick: (module: CourseModule) => void;
  onToggleComplete?: (module: CourseModule) => void;
  onUpcomingAssignmentClick: (cmId: number) => void;
};

export function CourseWorkspaceView({
  viewModel,
  course,
  exercises,
  loading,
  participants,
  participantsLoading,
  teacherStats,
  upcomingAssignments,
  upcomingAssignmentsLoading,
  courseColor,
  courseId,
  onModuleClick,
  onToggleComplete,
  onUpcomingAssignmentClick,
}: CourseWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabType>('temario');
  const { caps, tabs, enrichedSections, bannerProgress, bannerTotal, bannerDone, avgProgress } = viewModel;
  const showProgressBanner = caps.canViewProgressBanner && course;
  const showTeacherStats = caps.canReviewExercises;

  return (
    <WorkspaceLayout
      banner={
        <>
          {showProgressBanner && (
            <ProgressBanner
              color={courseColor}
              label="Tu progreso del trimestre"
              progress={bannerProgress}
              subtitle={bannerTotal > 0 ? `${bannerDone} de ${bannerTotal} actividades` : undefined}
              stats={[
                {
                  icon: '🏅',
                  value: '—',
                  label: 'Insignias',
                },
                {
                  icon: '📈',
                  value: '—',
                  label: 'Puesto',
                },
              ]}
            />
          )}

          {showTeacherStats && (
            <TeacherStatsBar
              studentsCount={teacherStats.studentsCount}
              activeCount={teacherStats.activeCount}
              avgProgress={avgProgress}
              pendingTotal={teacherStats.pendingTotal}
            />
          )}
        </>
      }
      tabs={<WorkspaceTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />}
      content={
        <WorkspaceContent
          activeTab={activeTab}
          sections={enrichedSections}
          exercises={exercises}
          participants={participants}
          loading={loading}
          participantsLoading={participantsLoading}
          courseId={courseId}
          onModuleClick={onModuleClick}
          onToggleComplete={showTeacherStats ? undefined : onToggleComplete}
          pendingByModule={showTeacherStats ? teacherStats.pendingByModule : undefined}
          teacherSectionProgress={showTeacherStats ? teacherStats.sectionProgress : undefined}
          canReviewExercises={showTeacherStats}
        />
      }
      sidebar={activeTab !== 'ejercicios' ? (
        <WorkspaceSidebar
          caps={caps}
          courseId={courseId}
          teacherStats={teacherStats}
          participants={participants}
          upcomingAssignments={upcomingAssignments}
          upcomingAssignmentsLoading={upcomingAssignmentsLoading}
          activeTab={activeTab}
          onUpcomingNavigate={onUpcomingAssignmentClick}
        />
      ) : null}
    />
  );
}

