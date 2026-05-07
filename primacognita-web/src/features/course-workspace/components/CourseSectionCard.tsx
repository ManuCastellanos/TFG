import { ChevronDown } from 'lucide-react';
import { SECTION_COLORS, stripHtml } from '../types/workspace.types';
import { useState } from 'react';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import CourseModuleRow from './CourseModuleRow';

type CourseSectionCardProps = {
  section: CourseSection;
  sectionNumber: number;
  colorIdx: number;
  defaultOpen: boolean;
  onModuleClick?: (module: CourseModule) => void;
};

const CourseSectionCard = ({
  section,
  sectionNumber,
  colorIdx,
  defaultOpen,
  onModuleClick,
}: CourseSectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);

  const isGeneral = section.id === 0;

  const safeColorIndex = colorIdx >= 0 ? colorIdx % SECTION_COLORS.length : 0;

  const sectionColor = SECTION_COLORS[safeColorIndex];

  const summary = stripHtml(section.summary);

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
          <h3 className="font-extrabold text-(--fg) text-lg leading-tight">{section.name}</h3>

          {summary && <p className="text-sm text-(--fg-subtle) mt-0.5 line-clamp-1">{summary}</p>}
        </div>

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
              <CourseModuleRow key={module.id} module={module} onModuleClick={onModuleClick} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSectionCard;
