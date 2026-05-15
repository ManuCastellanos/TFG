import { ChevronDown } from 'lucide-react';
import { SECTION_COLORS } from '../types/workspace.types';
import { stripHtml } from '../utils/workspace-mappers';
import { useState } from 'react';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import { toModuleVM } from '../utils/workspace-mappers';
import CourseModuleRow from './CourseModuleRow';
import { ProgressRing } from '@/components/ui/ProgressRing/ProgressRing';
import { InlineProgressBar } from '@/components/ui/progressBar/ProgressBar';
import { AddActivityButton } from './editor/AddActivityButton';
import { ConfirmDeleteModal } from './editor/ConfirmDeleteModal';
import { useSession } from '@/shared/hooks/useSession';

type ActivityType = 'assignment' | 'quiz' | 'resource' | 'url' | 'forum';

type CourseSectionCardProps = {
  section: CourseSection;
  sectionNumber: number;
  colorIdx: number;
  defaultOpen: boolean;
  progress?: number;
  onModuleClick?: (module: CourseModule) => void;
  onToggleComplete?: (module: CourseModule) => void;
  pendingByModule?: Record<number, number>;
  teacherSectionProgress?: number;
  onEditSection?: (sectionId: number, name: string, summary: string) => void;
  onAddActivity?: (sectionId: number, sectionNum: number, type: ActivityType) => void;
  onDeleteModule?: (cmid: number) => void;
  onDeleteSection?: (sectionId: number) => void;
};

const RING_COLORS = ['#10b981', '#0ea5e9', '#8b5cf6', '#f97316', '#ec4899'];

const CourseSectionCard = ({
  section,
  sectionNumber,
  colorIdx,
  defaultOpen,
  progress,
  onModuleClick,
  onToggleComplete,
  pendingByModule,
  teacherSectionProgress,
  onEditSection,
  onAddActivity,
  onDeleteModule,
  onDeleteSection,
}: CourseSectionCardProps) => {
  const { token } = useSession();
  const [open, setOpen] = useState(() => defaultOpen);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false);
  const [confirmDeleteCmid, setConfirmDeleteCmid] = useState<number | null>(null);

  const isGeneral = section.id === 0;
  const safeColorIndex = colorIdx >= 0 ? colorIdx % SECTION_COLORS.length : 0;
  const sectionColor = SECTION_COLORS[safeColorIndex];
  const ringColor = RING_COLORS[safeColorIndex % RING_COLORS.length];
  const summary = stripHtml(section.summary);

  const isTeacherMode = pendingByModule !== undefined;
  const canEdit = isTeacherMode && !isGeneral && !!onEditSection;
  const hasRing =
    !isGeneral && !isTeacherMode && progress != null && section.modules.some((m) => m.completion?.hasCompletion);

  const toggleOpen = () => setOpen((v) => !v);

  const handlePencilClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editMode) {
      setEditName(section.name);
      setEditSummary(section.summary ?? '');
      if (!open) setOpen(true);
    }
    setEditMode((v) => !v);
  };

  const handleSaveSection = () => {
    onEditSection!(section.id, editName, editSummary);
    setEditMode(false);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteCmid !== null) {
      onDeleteModule?.(confirmDeleteCmid);
      setConfirmDeleteCmid(null);
    }
  };

  const moduleVMs = section.modules.map((m) => toModuleVM(m, pendingByModule?.[m.cmid], token ?? undefined));

  return (
    <div className="rounded-3xl border border-(--border) bg-white overflow-hidden mb-2">
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
        className="flex items-center gap-4 w-full p-5 text-left hover:bg-(--tint-50) transition cursor-pointer"
      >
        {isGeneral ? (
          <div className="size-14 rounded-2xl bg-neutral-100 grid place-items-center text-2xl shrink-0">📣</div>
        ) : (
          <div
            className={`size-14 rounded-2xl ${sectionColor.soft} ${sectionColor.text} grid place-items-center font-extrabold text-xl shrink-0`}
          >
            {sectionNumber}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {editMode && canEdit ? (
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-0.5">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-(--fg) text-lg leading-tight w-full bg-transparent border-0 border-b border-dashed border-(--fg-muted) outline-none"
              />
              <input
                type="text"
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Descripción (opcional)"
                className="text-sm text-(--fg-subtle) w-full bg-transparent border-0 border-b border-dashed border-(--border) outline-none mt-0.5"
              />
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-(--fg) text-lg leading-tight">{section.name}</h3>
              {summary && <p className="text-sm text-(--fg-subtle) mt-0.5 line-clamp-1">{summary}</p>}
            </>
          )}
        </div>

        {hasRing && <ProgressRing value={progress!} size={56} color={ringColor} />}
        {isTeacherMode && !isGeneral && teacherSectionProgress !== undefined && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-xs text-(--fg-subtle) font-bold">Avance medio</span>
              <span className={`font-extrabold ${sectionColor.text}`}>{teacherSectionProgress}%</span>
            </div>
            <InlineProgressBar
              value={teacherSectionProgress}
              colorClass={sectionColor.grad}
              height="h-2"
              className="w-20"
            />
          </div>
        )}

        {canEdit && editMode && onDeleteSection && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setConfirmDeleteSection(true); }}
            aria-label="Eliminar tema"
            className="size-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 grid place-items-center shrink-0 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4" aria-hidden>
              <path d="M5 12h14" />
            </svg>
          </button>
        )}

        {canEdit && (
          <button
            type="button"
            onClick={handlePencilClick}
            aria-label={editMode ? 'Desactivar edición' : 'Editar tema'}
            className="relative size-8 rounded-xl  hover:bg-orange-100 grid place-items-center shrink-0 transition"
          >
            <span className="text-base leading-none">✏️</span>
            {editMode && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 border-2 border-white" />
            )}
          </button>
        )}

        <ChevronDown className={`size-5 text-(--fg-muted) transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-2">
          {editMode && canEdit && (
            <div className="flex justify-end gap-2 py-1">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="text-sm text-(--fg-muted) hover:text-(--fg) transition px-2 py-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveSection}
                className="text-sm font-semibold text-white bg-[#274E38] hover:brightness-110 rounded-xl px-3 py-1 transition"
              >
                Guardar
              </button>
            </div>
          )}

          {section.modules.length === 0 ? (
            <p className="text-sm text-(--fg-subtle) px-4 py-3">Aún no hay contenido en este tema.</p>
          ) : (
            moduleVMs.map((vm) => (
              <CourseModuleRow
                key={vm.id}
                module={vm}
                onClick={
                  vm.isInternal ? () => onModuleClick?.(section.modules.find((m) => m.cmid === vm.cmid)!) : undefined
                }
                onToggle={
                  vm.showCompletion && !isTeacherMode
                    ? () => onToggleComplete?.(section.modules.find((m) => m.cmid === vm.cmid)!)
                    : undefined
                }
                onDelete={editMode && onDeleteModule ? () => setConfirmDeleteCmid(vm.cmid) : undefined}
                hideCompletion={isTeacherMode}
              />
            ))
          )}

          {isTeacherMode && onAddActivity && (
            <div className="pt-2 border-t border-dashed border-(--border)">
              <AddActivityButton onSelect={(type) => onAddActivity(section.id, sectionNumber, type)} />
            </div>
          )}
        </div>
      )}

      <ConfirmDeleteModal
        open={confirmDeleteCmid !== null}
        onClose={() => setConfirmDeleteCmid(null)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDeleteModal
        open={confirmDeleteSection}
        onClose={() => setConfirmDeleteSection(false)}
        onConfirm={() => { onDeleteSection?.(section.id); setConfirmDeleteSection(false); }}
        title="¿Eliminar este tema?"
        message="Se eliminarán también todas las actividades que contiene. Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default CourseSectionCard;
