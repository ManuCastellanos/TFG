import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { InlineProgressBar } from '@/components/ui/progressBar/ProgressBar';
import { useCourseCustomization } from '@/shared/hooks/useCourseCustomization';
import { COLOR_META } from '@/shared/theme/courseColors';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import CourseColorPicker from './CourseColorPicker';
import type { Course } from '@/modules/course/domain/Course';
import type { CourseColor } from '@/shared/theme/courseColors';

type CourseLibCardProps = {
  course: Course;
  index: number;
  onClick: () => void;
};

const CourseLibCard = ({ course, index, onClick }: CourseLibCardProps) => {
  const progress = course.progress ?? 0;
  const { color, update } = useCourseCustomization(course.id, index);
  const c = COLOR_META[color];
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapRef, () => setPickerOpen(false));

  return (
    <div ref={wrapRef} className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex flex-col rounded-3xl overflow-hidden border-2 border-(--border) bg-white text-left transition hover:shadow-md hover:-translate-y-0.5 ${c.hover}`}
      >
        <div className="relative h-32 overflow-hidden">
          {course.imageUrl ? (
            <img src={course.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-linear-to-br ${c.grad} grid place-items-center`}>
              <span className="text-5xl font-extrabold text-white/70">
                {course.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {course.completed && (
            <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm">
              ✓ Completado
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-(--fg) text-base leading-tight line-clamp-2 mb-1">
              {course.fullname}
            </h3>
            <p className={`text-xs font-bold ${c.text}`}>{course.shortname}</p>
          </div>
          <div>
            <InlineProgressBar value={progress} colorClass={c.grad} height="h-2" className="mb-1.5" />
            <div className="flex items-center justify-between text-xs">
              <span className={`font-extrabold ${c.text}`}>{progress}% completado</span>
            </div>
          </div>
        </div>
      </button>

      <Button
        variant="outline"
        size="icon"
        type="button"
        aria-label="Personalizar color del curso"
        onClick={(e) => { e.stopPropagation(); setPickerOpen((v) => !v); }}
        className="absolute top-2 right-2 size-7 rounded-xl opacity-0 group-hover:opacity-100 z-10 shadow-sm"
        style={{ opacity: pickerOpen ? 1 : undefined }}
      >
        <Pencil className="size-3.5" />
      </Button>

      {pickerOpen && (
        <CourseColorPicker
          color={color}
          onColorChange={(newColor) => update({ color: newColor as CourseColor })}
        />
      )}
    </div>
  );
};

export default CourseLibCard;
