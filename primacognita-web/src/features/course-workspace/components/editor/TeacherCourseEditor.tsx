import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button/Button';
import { Alert } from '@/components/ui/alert/Alert';
import CourseSectionCard from '../CourseSectionCard';
import { CreateResourceModal } from './CreateResourceModal';
import { CreateUrlModal } from './CreateUrlModal';
import { CreateForumModal } from './CreateForumModal';
import { useCourseEditor } from '../../hooks/useCourseEditor';
import { useSession } from '@/shared/hooks/useSession';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'url' | 'forum';

type TeacherCourseEditorProps = {
  courseId: string;
  sections: { section: CourseSection; colorIdx: number; sectionNumber: number; progress?: number }[];
  pendingByModule: Record<number, number>;
  teacherSectionProgress: Record<number, number>;
  onModuleClick: (module: CourseModule) => void;
};

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
  const navigate = useNavigate();

  const [addActivity, setAddActivity] = useState<AddActivityState>(null);

  const handleEditSection = (sectionId: number, name: string, summary: string) => {
    editor.updateSection.mutate({ sectionId, name, summary });
  };

  const handleAddActivity = (sectionId: number, sectionNum: number, type: ActivityType) => {
    if (type === 'assignment') {
      void navigate({
        to: '/courses/$courseId/assignments/create/$sectionNum',
        params: { courseId, sectionNum: String(sectionNum) },
      });
      return;
    }
    if (type === 'quiz') {
      void navigate({
        to: '/courses/$courseId/quiz/create/$sectionNum',
        params: { courseId, sectionNum: String(sectionNum) },
      });
      return;
    }
    setAddActivity({ sectionId, sectionNum, type });
  };

  const handleDeleteModule = (cmid: number) => {
    editor.deleteModule.mutate(cmid);
  };

  const handleDeleteSection = (sectionId: number) => {
    editor.deleteSection.mutate({ sectionId });
  };

  const closeAddActivity = () => setAddActivity(null);

  const targetSection = addActivity ? sections.find((s) => s.section.id === addActivity.sectionId) : null;
  const courseIdNum = Number(courseId);

  return (
    <>
      {editor.deleteSection.isError && (
        <Alert variant="error">
          Error al eliminar el tema: {(editor.deleteSection.error as Error)?.message}
        </Alert>
      )}

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
          onDeleteModule={handleDeleteModule}
          onDeleteSection={handleDeleteSection}
        />
      ))}

      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-(--border) rounded-2xl py-3 text-(--fg-muted) hover:text-(--fg) hover:border-(--fg-muted) transition"
          onClick={() => editor.createSection.mutate({ courseId: courseIdNum, name: 'Nuevo tema', summary: '' })}
          disabled={editor.createSection.isPending}
        >
          <Plus className="size-4" />
          {editor.createSection.isPending ? 'Creando tema…' : 'Añadir tema'}
        </Button>
      </div>

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

      {addActivity?.type === 'forum' && targetSection && (
        <CreateForumModal
          open
          onClose={closeAddActivity}
          courseId={courseIdNum}
          sectionNum={addActivity.sectionNum}
          loading={editor.createForum.isPending}
          onSave={(input) => {
            editor.createForum.mutate(input, { onSuccess: closeAddActivity });
          }}
        />
      )}
    </>
  );
}
