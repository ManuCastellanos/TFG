import { LoadingState } from "@/components/patterns/loadingState/LoadingState";
import CourseSectionCard from "../CourseSectionCard";
import { TeacherCourseEditor } from "../editor/TeacherCourseEditor";
import { TaskView } from "../../sections/student/task/TaskView";
import { CalificationsView } from "../../sections/student/califications/CalificationsView";
import { ParticipantsView } from "../../sections/student/participants/ParticipantsView";
import { AnnouncementsView } from "../../sections/student/announcements/AnnouncementsView";
import type { WorkspaceTab } from "../../types/workspace.types";
import type { CourseModule, CourseSection } from "@/modules/course/domain/CourseSection";
import type { Participant } from "@/modules/course/domain/Participant";

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
};

const tabClass = (tab: WorkspaceTab, activeTab: WorkspaceTab) =>
  tab === activeTab ? "block" : "hidden";

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
}: WorkspaceContentProps) => {
  if (loading) return <LoadingState emoji="📖" label="Cargando contenido…" />;

  return (
    <>
      <div className={tabClass("temario", activeTab)}>
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

      <div className={tabClass("ejercicios", activeTab)}>
        <TaskView
          exercises={exercises}
          sections={sections.map((s) => s.section)}
          courseId={courseId}
          onExerciseClick={onModuleClick}
        />
      </div>

      <div className={tabClass("logros", activeTab)}>
        <CalificationsView
          sections={sections.map((s) => s.section)}
          exercises={exercises}
          courseId={courseId}
          onExerciseClick={(cmid, modName) => {
            const mod = exercises.find((e) => e.cmid === cmid && e.modName === modName);
            if (mod) onModuleClick(mod);
          }}
        />
      </div>

      <div className={tabClass("anuncios", activeTab)}>
        <AnnouncementsView courseId={courseId} />
      </div>

      <div className={tabClass("companeros", activeTab)}>
        <ParticipantsView participants={participants} loading={participantsLoading} />
      </div>
    </>
  );
};
