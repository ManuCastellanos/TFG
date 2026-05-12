import { Pencil } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button/Button';
import { useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import { COLOR_META, COURSE_COLORS } from '@/shared/theme/courseColors';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { InlineProgressBar } from '@/components/ui/progressBar/ProgressBar';
import CourseCustomizerPopover from './CourseCustomizerPopover';
import type { Course } from '@/modules/course/domain/Course';

const DashCourseCard = ({ course, index, onClick }: { course: Course; index: number; onClick: () => void }) => {
  const progress = course.progress ?? 0;
  const { emoji, color, update } = useCourseCustomization(course.id, index);
  const c = COLOR_META[color];
  const [pickerOpen, setPickerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useClickOutside(cardRef, () => setPickerOpen(false));

  return (
    <div ref={cardRef} className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`w-full relative rounded-3xl p-5 border-2 text-left transition overflow-hidden bg-white border-(--border) ${c.hover} hover:shadow-md hover:-translate-y-0.5`}
      >
        <div className={`absolute -top-10 -right-10 size-40 rounded-full opacity-20 blur-2xl ${c.glow}`} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`size-12 rounded-2xl bg-linear-to-br ${c.grad} grid place-items-center text-2xl shadow-sm shrink-0`}
            >
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-(--fg) text-base leading-tight truncate">{course.fullname}</h3>
            </div>
          </div>
          <InlineProgressBar value={progress} colorClass={c.grad} height="h-2" className="mb-1.5" />
          <div className="flex items-center justify-between text-xs">
            <span className={`font-black ${c.text}`}>Progreso</span>
            <span className={`font-black ${c.text}`}>{progress}%</span>
          </div>
        </div>
      </button>

      <Button
        variant="outline"
        size="icon"
        type="button"
        aria-label="Personalizar curso"
        onClick={(e) => {
          e.stopPropagation();
          setPickerOpen((v) => !v);
        }}
        className="absolute top-3 right-3 size-7 rounded-xl opacity-0 group-hover:opacity-100 z-10 shadow-sm"
        style={{ opacity: pickerOpen ? 1 : undefined }}
      >
        <Pencil className="size-3.5" />
      </Button>

      {pickerOpen && (
        <CourseCustomizerPopover
          emoji={emoji}
          color={color}
          onEmojiChange={(e) => update({ emoji: e })}
          onColorChange={(c) => update({ color: c as (typeof COURSE_COLORS)[number] })}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default DashCourseCard;
