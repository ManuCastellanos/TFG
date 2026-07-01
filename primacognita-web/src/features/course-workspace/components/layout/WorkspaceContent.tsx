import { WorkspaceSkeleton } from './WorkspaceSkeleton';
import CourseSectionCard from '../CourseSectionCard';
import { TeacherCourseEditor } from '../editor/TeacherCourseEditor';
import { TaskView } from '../../sections/student/task/TaskView';
import { CalificationsView } from '../../sections/student/califications/CalificationsView';
import { ParticipantsView } from '../../sections/student/participants/ParticipantsView';
import { AnnouncementsView } from '../../sections/student/announcements/AnnouncementsView';
import { TeacherPendingView } from '../../sections/teacher/pending/TeacherPendingView';
import { TeacherGradebookView } from '../../sections/teacher/gradebook/TeacherGradebookView';
import type { WorkspaceTab } from '../../types/workspace.types';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import type { Participant } from '@/modules/course/domain/Participant';
import type { GradeEntry } from '@/modules/assignment/domain/GradeEntry';
import type { PendingItem } from '../../view-models/types';

type WorkspaceContentProps = {
  activeTab: WorkspaceTab;
  sections: { section: CourseSection; colorIdx: number; sectionNumber: number; progress?: number }[];
  exercises: CourseModule[];
  participants: Participant[];
  loading: boolean;
  participantsLoading: boolean;
  courseId: string;
  onModuleClick: (module: CourseModule) => void;
  onToggleComplete?: (module: CourseModule) => void;
  pendingByModule?: Record<number, number>;
  teacherSectionProgress?: Record<number, number>;
  canReviewExercises: boolean;
  pendingItems?: PendingItem[];
  teacherAssignments?: { id: number; cmId: number; title: string; maxGrade: number }[];
  gradesByAssign?: Record<number, GradeEntry[]>;
};

const tabClass = (tab: WorkspaceTab, activeTab: WorkspaceTab) => (tab === activeTab ? 'block' : 'hidden');

export const WorkspaceContent = ({
  activeTab,
  sections,
  exercises,
  participants,
  loading,
  participantsLoading,
  courseId,
  onModuleClick,
  onToggleComplete,
  pendingByModule,
  teacherSectionProgress,
  canReviewExercises,
  pendingItems,
  teacherAssignments,
  gradesByAssign,
}: WorkspaceContentProps) => {
  if (loading) return <WorkspaceSkeleton />;

  return (
    <>
      <div className={tabClass('temario', activeTab)}>
        {sections.length === 0 ? (
          <p className="text-sm text-(--fg-subtle)">Este curso aún no tiene temas.</p>
        ) : pendingByModule !== undefined ? (
          <TeacherCourseEditor
            courseId={courseId}
            sections={sections}
            pendingByModule={pendingByModule}
            teacherSectionProgress={teacherSectionProgress ?? {}}
            onModuleClick={onModuleClick}
          />
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
            />
          ))
        )}
      </div>

      <div className={tabClass('ejercicios', activeTab)}>
        {canReviewExercises ? (
          <TeacherPendingView courseId={courseId} items={pendingItems ?? []} />
        ) : (
          <TaskView
            exercises={exercises}
            sections={sections.map((s) => s.section)}
            courseId={courseId}
            onExerciseClick={onModuleClick}
          />
        )}
      </div>

      <div className={tabClass('logros', activeTab)}>
        {canReviewExercises ? (
          <TeacherGradebookView
            courseId={courseId}
            sections={sections.map((s) => s.section)}
            participants={participants}
            assignments={teacherAssignments ?? []}
            gradesByAssign={gradesByAssign ?? {}}
          />
        ) : (
          <CalificationsView
            sections={sections.map((s) => s.section)}
            exercises={exercises}
            courseId={courseId}
            onExerciseClick={(cmid, modName) => {
              const mod = exercises.find((e) => e.cmid === cmid && e.modName === modName);
              if (mod) onModuleClick(mod);
            }}
          />
        )}
      </div>

      <div className={tabClass('anuncios', activeTab)}>
        <AnnouncementsView courseId={courseId} />
      </div>

      <div className={tabClass('companeros', activeTab)}>
        <ParticipantsView participants={participants} loading={participantsLoading} />
      </div>
    </>
  );
};
