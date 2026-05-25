import { Check, ChevronDown, Pencil, Trash2 } from 'lucide-react';
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
  const changesCount =
    (editName !== section.name ? 1 : 0) +
    (editSummary !== (section.summary ?? '') ? 1 : 0);
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

  const card = (
    <div
      className={`relative rounded-3xl bg-white overflow-hidden ${editMode ? '' : 'border border-(--border)'}`}
      style={editMode ? { boxShadow: '0 0 0 2px rgb(110 231 183), 0 12px 32px -16px rgb(0 0 0 / 0.12)' } : undefined}
    >
      {/* Edit-mode top strip */}
      {editMode && canEdit && (
        <div className="absolute top-0 left-0 right-0 h-9 bg-linear-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider">
            <Pencil className="size-3.5" />
            Estás editando este tema
          </div>
          {onDeleteSection && (
            <button
              type="button"
              aria-label="Eliminar tema"
              onClick={(e) => { e.stopPropagation(); setConfirmDeleteSection(true); }}
              className="flex items-center gap-1.5 px-2 h-6 rounded-full bg-white/15 hover:bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider transition"
            >
              <Trash2 className="size-3" />
              Eliminar
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
        className={`flex items-center gap-4 w-full text-left transition cursor-pointer ${editMode ? 'p-5 pt-12' : 'p-5 hover:bg-(--tint-50)'}`}
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

        {editMode && canEdit ? (
          <div onClick={(e) => e.stopPropagation()} className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="relative">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-(--fg) text-lg leading-tight w-full bg-white border border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none rounded-lg px-3 py-1.5 transition"
              />
              <span className="absolute -top-2 left-2.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-white px-1">Título</span>
            </div>
            <div className="relative mt-1">
              <input
                type="text"
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Descripción (opcional)"
                className="text-sm text-(--fg-muted) placeholder:text-(--fg-subtle) w-full bg-white border border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none rounded-lg px-3 py-1.5 transition"
              />
              <span className="absolute -top-2 left-2.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 bg-white px-1">Descripción</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-(--fg) text-lg leading-tight">{section.name}</h3>
            {summary && <p className="text-sm text-(--fg-subtle) mt-0.5 line-clamp-1">{summary}</p>}
          </div>
        )}

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

        {canEdit && (
          <button
            type="button"
            onClick={handlePencilClick}
            aria-label={editMode ? 'Desactivar edición' : 'Editar tema'}
            className="relative size-8 rounded-xl hover:bg-orange-100 grid place-items-center shrink-0 transition"
          >
            <span className="text-base leading-none">✏️</span>
            {editMode && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </button>
        )}

        <ChevronDown className={`size-5 text-(--fg-muted) transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </div>

      {/* Save/cancel bar — always visible in edit mode */}
      {editMode && canEdit && (
        <div className="px-5 py-3 border-t border-emerald-500/20 bg-emerald-500/8 flex items-center justify-between">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {changesCount} cambios sin guardar
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="text-sm text-(--fg-muted) hover:text-(--fg) transition px-3 py-1"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveSection}
              className="flex items-center gap-1.5 text-sm font-extrabold text-white bg-[#274E38] hover:brightness-110 rounded-full px-4 py-1.5 transition"
            >
              <Check className="size-3.5" />
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
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
    </div>
  );

  return (
    <div className={editMode ? 'mb-2 rounded-[28px] bg-(--tint-100) p-3' : 'mb-2'}>
      {card}

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
