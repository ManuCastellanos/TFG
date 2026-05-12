import { EmptyState } from '@/components/patterns/emptyState/EmptyState';
import CourseSectionCard from '../shared/CourseSectionCard';
import { TaskView } from '../student/TaskView';
import { ParticipantsView } from '../student/ParticipantsView';
import type { WorkspaceTab } from '../../types/workspace.types';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';

type WorkspaceContentProps = {
  activeTab: WorkspaceTab;
  sections: { section: CourseSection; colorIdx: number; sectionNumber: number; progress?: number }[];
  exercises: CourseModule[];
  participants: Participant[];
  loading: boolean;
  participantsLoading: boolean;
  onModuleClick: (module: CourseModule) => void;
  onToggleComplete?: (module: CourseModule) => void;
  pendingByModule?: Record<number, number>;
  teacherSectionProgress?: Record<number, number>;
  canReviewExercises: boolean;
};

export const WorkspaceContent = ({
  activeTab,
  sections,
  exercises,
  participants,
  loading,
  participantsLoading,
  onModuleClick,
  onToggleComplete,
  pendingByModule,
  teacherSectionProgress,
}: WorkspaceContentProps) => {
  if (loading) return <p className="text-sm text-(--fg-muted)">Cargando contenido…</p>;

  switch (activeTab) {
    case 'temario':
      return sections.length === 0 ? (
        <p className="text-sm text-(--fg-subtle)">Este curso aún no tiene temas.</p>
      ) : (
        sections.map(({ section, colorIdx, sectionNumber, progress }, idx) => (
          <CourseSectionCard
            key={section.id}
            section={section}
            sectionNumber={sectionNumber}
            colorIdx={colorIdx}
            defaultOpen={idx === 1}
            progress={progress}
            onModuleClick={onModuleClick}
            onToggleComplete={onToggleComplete}
            pendingByModule={pendingByModule}
            teacherSectionProgress={teacherSectionProgress?.[section.id]}
          />
        ))
      );

    case 'ejercicios':
      return <TaskView exercises={exercises} onExerciseClick={onModuleClick} />;

    case 'logros':
      return (
        <EmptyState emoji="🏆" title="Próximamente disponible" subtitle="Esta sección estará disponible en una próxima versión." />
      );

    case 'anuncios':
      return (
        <EmptyState emoji="📣" title="Próximamente disponible" subtitle="Esta sección estará disponible en una próxima versión." />
      );

    case 'companeros':
      return <ParticipantsView participants={participants} loading={participantsLoading} />;

    default:
      { const _exhaustiveCheck: never = activeTab;
      return _exhaustiveCheck; }
  }
};
