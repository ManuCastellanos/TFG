import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import { TeacherCuadModuleRow } from './TeacherCuadModuleRow';
import { TeacherSectionEditor } from './TeacherSectionEditor';
import type { CourseSection } from '@/modules/course/domain/CourseSection';

type TeacherCuadSectionProps = {
  section: CourseSection;
  sectionNumber: number;
  colorIdx: number;
  defaultOpen?: boolean;
  onEditSection: (sectionId: number, name: string, summary: string) => void;
  onAddActivity: (sectionId: number, sectionNum: number) => void;
};

export function TeacherCuadSection({
  section,
  sectionNumber,
  colorIdx,
  defaultOpen = false,
  onEditSection,
  onAddActivity,
}: TeacherCuadSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const safeColorIdx = colorIdx >= 0 ? colorIdx % SECTION_COLORS.length : 0;
  const color = SECTION_COLORS[safeColorIdx];
  const isGeneral = section.id === 0;

  const handleToggle = () => {
    if (!editing) setOpen(!open);
  };

  const handlePencil = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(!editing);
    if (!open) setOpen(true);
  };

  return (
    <div className="rounded-3xl border border-(--border) bg-white overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-4 w-full p-5 text-left hover:bg-(--tint-50) transition"
      >
        {isGeneral ? (
          <div className="size-14 rounded-2xl bg-neutral-100 grid place-items-center text-2xl shrink-0">📣</div>
        ) : (
          <div
            className={`size-14 rounded-2xl ${color.soft} ${color.text} grid place-items-center font-extrabold text-xl shrink-0`}
          >
            {sectionNumber}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-(--fg) text-lg leading-tight">{section.name}</h3>
          {section.summary && <p className="text-sm text-(--fg-subtle) mt-0.5 line-clamp-1">{section.summary}</p>}
        </div>
        <button
          type="button"
          onClick={handlePencil}
          className="size-8 rounded-xl hover:bg-(--tint-100) grid place-items-center text-sm shrink-0"
        >
          ✏️
        </button>
        <ChevronDown className={`size-5 text-(--fg-muted) shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-2">
          {editing && (
            <TeacherSectionEditor
              sectionName={section.name}
              sectionSummary={section.summary ?? ''}
              onSave={(name, summary) => {
                onEditSection(section.id, name, summary);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          )}

          {section.modules.length === 0 ? (
            <p className="text-sm text-(--fg-subtle) px-4 py-3">Aún no hay contenido en este tema.</p>
          ) : (
            section.modules.map((mod) => <TeacherCuadModuleRow key={mod.id} module={mod} />)
          )}

          <button
            type="button"
            onClick={() => onAddActivity(section.id, sectionNumber)}
            className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-(--border) rounded-2xl py-3 text-sm font-extrabold text-(--fg-muted) hover:text-emerald-700 hover:border-emerald-300 transition"
          >
            <Plus className="size-4" />
            Añadir actividad
          </button>
        </div>
      )}
    </div>
  );
}
