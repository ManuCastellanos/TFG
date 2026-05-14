import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import CourseSectionCard from '../CourseSectionCard';
import { EditSectionModal } from './EditSectionModal';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { CreateQuizModal } from './CreateQuizModal';
import { CreateResourceModal } from './CreateResourceModal';
import { CreateUrlModal } from './CreateUrlModal';
import { useCourseEditor } from '../../hooks/useCourseEditor';
import { useSession } from '@/shared/hooks/useSession';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'url';

type TeacherCourseEditorProps = {
  courseId: string;
  sections: { section: CourseSection; colorIdx: number; sectionNumber: number; progress?: number }[];
  pendingByModule: Record<number, number>;
  teacherSectionProgress: Record<number, number>;
  onModuleClick: (module: CourseModule) => void;
};

type EditSectionState = { sectionId: number; name: string; summary: string } | null;
type AddActivityState = { sectionId: number; sectionNum: number; type: ActivityType } | null;

export function TeacherCourseEditor({
  courseId,
  sections,
  pendingByModule,
  teacherSectionProgress,
  onModuleClick,
}: TeacherCourseEditorProps) {
  const { token } = useSession();
  const editor = useCourseEditor(courseId, token);

  const [editSection, setEditSection] = useState<EditSectionState>(null);
  const [addActivity, setAddActivity] = useState<AddActivityState>(null);

  const handleEditSection = (sectionId: number, name: string, summary: string) => {
    setEditSection({ sectionId, name, summary: summary ?? '' });
  };

  const handleAddActivity = (sectionId: number, sectionNum: number, type: ActivityType) => {
    setAddActivity({ sectionId, sectionNum, type });
  };

  const closeEditSection = () => setEditSection(null);
  const closeAddActivity = () => setAddActivity(null);

  const targetSection = addActivity
    ? sections.find((s) => s.section.id === addActivity.sectionId)
    : null;
  const courseIdNum = Number(courseId);

  return (
    <>
      {sections.map(({ section, colorIdx, sectionNumber, progress }, idx) => (
        <CourseSectionCard
          key={section.id}
          section={section}
          sectionNumber={sectionNumber}
          colorIdx={colorIdx}
          defaultOpen={idx === 1}
          progress={progress}
          onModuleClick={onModuleClick}
          pendingByModule={pendingByModule}
          teacherSectionProgress={teacherSectionProgress?.[section.id]}
          onEditSection={handleEditSection}
          onAddActivity={handleAddActivity}
        />
      ))}

      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-(--border) rounded-2xl py-3 text-(--fg-muted) hover:text-(--fg) hover:border-(--fg-muted) transition"
          onClick={() =>
            editor.createSection.mutate({ courseId: courseIdNum, name: 'Nuevo tema', summary: '' })
          }
          disabled={editor.createSection.isPending}
        >
          <Plus className="size-4" />
          {editor.createSection.isPending ? 'Creando tema…' : 'Añadir tema'}
        </Button>
      </div>

      {editSection && (
        <EditSectionModal
          open
          onClose={closeEditSection}
          sectionId={editSection.sectionId}
          initialName={editSection.name}
          initialSummary={editSection.summary}
          loading={editor.updateSection.isPending}
          onSave={(input) => {
            editor.updateSection.mutate(input, { onSuccess: closeEditSection });
          }}
        />
      )}

      {addActivity?.type === 'assignment' && targetSection && (
        <CreateAssignmentModal
          open
          onClose={closeAddActivity}
          courseId={courseIdNum}
          sectionNum={addActivity.sectionNum}
          loading={editor.createAssignment.isPending}
          onSave={(input) => {
            editor.createAssignment.mutate(input, { onSuccess: closeAddActivity });
          }}
        />
      )}

      {addActivity?.type === 'quiz' && targetSection && (
        <CreateQuizModal
          open
          onClose={closeAddActivity}
          courseId={courseIdNum}
          sectionNum={addActivity.sectionNum}
          loading={editor.createQuiz.isPending}
          onSave={(input) => {
            editor.createQuiz.mutate(input, { onSuccess: closeAddActivity });
          }}
        />
      )}

      {addActivity?.type === 'url' && targetSection && (
        <CreateUrlModal
          open
          onClose={closeAddActivity}
          courseId={courseIdNum}
          sectionNum={addActivity.sectionNum}
          loading={editor.createUrl.isPending}
          onSave={(input) => {
            editor.createUrl.mutate(input, { onSuccess: closeAddActivity });
          }}
        />
      )}

      {addActivity?.type === 'resource' && targetSection && token && (
        <CreateResourceModal
          open
          onClose={closeAddActivity}
          courseId={courseIdNum}
          sectionNum={addActivity.sectionNum}
          token={token}
          loading={editor.createResource.isPending}
          onSave={(input) => {
            editor.createResource.mutate(input, { onSuccess: closeAddActivity });
          }}
        />
      )}
    </>
  );
}
