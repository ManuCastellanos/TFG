import { Pencil } from 'lucide-react';
import CourseCustomizerPopover from './CourseCustomizerPopover';
import { useEffect, useRef, useState } from 'react';
import { COLOR_META, COURSE_COLORS, useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import type { Course } from '@/modules/course/domain/Course';

const DashCourseCard = ({ course, index, onClick }: { course: Course; index: number; onClick: () => void }) => {
  const progress = course.progress ?? 0;
  const { emoji, color, update } = useCourseCustomization(course.id, index);
  const c = COLOR_META[color];
  const [pickerOpen, setPickerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const close = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [pickerOpen]);

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
              <h3 className="font-black text-(--fg) text-base leading-tight truncate">{course.fullname}</h3>
            </div>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 mb-1.5">
            <div
              className={`h-full rounded-full bg-linear-to-r ${c.grad} transition-all`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-black ${c.text}`}>Progreso</span>
            <span className={`font-black ${c.text}`}>{progress}%</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        aria-label="Personalizar curso"
        onClick={(e) => {
          e.stopPropagation();
          setPickerOpen((v) => !v);
        }}
        className="absolute top-3 right-3 size-7 rounded-xl bg-white border border-(--border) grid place-items-center text-(--fg-muted) opacity-0 group-hover:opacity-100 transition z-10 shadow-sm hover:bg-(--tint-50)"
        style={{ opacity: pickerOpen ? 1 : undefined }}
      >
        <Pencil className="size-3.5" />
      </button>

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
