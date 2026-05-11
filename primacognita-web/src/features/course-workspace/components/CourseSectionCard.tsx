import { ChevronDown, Plus } from 'lucide-react';
import { SECTION_COLORS, stripHtml } from '../types/workspace.types';
import { useState } from 'react';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import CourseModuleRow from './CourseModuleRow';
import { ProgressRing } from '@/components/ui/ProgressRing/ProgressRing';
import ProgressBar from '@/components/ui/progressBar/ProgressBar';

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
};

const RING_COLORS = [
  '#10b981', '#0ea5e9', '#8b5cf6', '#f97316', '#ec4899',
];

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
}: CourseSectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);

  const isGeneral = section.id === 0;
  const safeColorIndex = colorIdx >= 0 ? colorIdx % SECTION_COLORS.length : 0;
  const sectionColor = SECTION_COLORS[safeColorIndex];
  const ringColor = RING_COLORS[safeColorIndex % RING_COLORS.length];
  const summary = stripHtml(section.summary);

  const isTeacherMode = pendingByModule !== undefined;
  const hasRing =
    !isGeneral &&
    !isTeacherMode &&
    progress != null &&
    section.modules.some((m) => m.completion?.hasCompletion);

  const toggleOpen = () => {
    setOpen((isOpen) => !isOpen);
  };

  return (
    <div className="rounded-3xl border border-(--border) bg-white overflow-hidden">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-4 w-full p-5 text-left hover:bg-(--tint-50) transition"
      >
        {isGeneral ? (
          <div className="size-14 rounded-2xl bg-neutral-100 grid place-items-center text-2xl shrink-0">📣</div>
        ) : (
          <div
            className={`
              size-14
              rounded-2xl
              ${sectionColor.soft}
              ${sectionColor.text}
              grid
              place-items-center
              font-extrabold
              text-xl
              shrink-0
            `}
          >
            {sectionNumber}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-(--fg) text-lg leading-tight">{section.name}</h3>
          {summary && <p className="text-sm text-(--fg-subtle) mt-0.5 line-clamp-1">{summary}</p>}
        </div>

        {hasRing && (
          <ProgressRing value={progress!} size={56} color={ringColor} />
        )}
        {isTeacherMode && !isGeneral && teacherSectionProgress !== undefined && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-xs text-(--fg-subtle) font-bold">Avance medio</span>
              <span className={`font-extrabold ${sectionColor.text}`}>{teacherSectionProgress}%</span>
            </div>
            <ProgressBar.Core value={teacherSectionProgress} colorClass={sectionColor.grad} height="h-2" className="w-20" />
          </div>
        )}

        <ChevronDown
          className={`
            size-5
            text-(--fg-muted)
            transition-transform
            shrink-0
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-2">
          {section.modules.length === 0 ? (
            <p className="text-sm text-(--fg-subtle) px-4 py-3">Aún no hay contenido en este tema.</p>
          ) : (
            section.modules.map((module) => (
              <CourseModuleRow
                key={module.id}
                module={module}
                onModuleClick={onModuleClick}
                onToggleComplete={onToggleComplete}
                pendingCount={pendingByModule ? (pendingByModule[module.cmid] ?? 0) : undefined}
              />
            ))
          )}
          {isTeacherMode && (
            <div className="pt-2 border-t border-dashed border-(--border)">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                <Plus className="size-4" />
                Añadir actividad
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSectionCard;
