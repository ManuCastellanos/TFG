import { COURSE_COLORS, COLOR_META } from '@/shared/theme/courseColors';
import type { CourseColor } from '@/shared/theme/courseColors';

type CourseColorPickerProps = {
  color: string;
  onColorChange: (c: CourseColor) => void;
};

const CourseColorPicker = ({ color, onColorChange }: CourseColorPickerProps) => (
  <div
    role="presentation"
    className="absolute top-10 right-2 z-30 bg-white rounded-2xl p-3 shadow-2xl border border-(--border)"
    onClick={(e) => e.stopPropagation()}
  >
    <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-2">Color</p>
    <div className="flex flex-wrap gap-2">
      {COURSE_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={(ev) => { ev.stopPropagation(); onColorChange(c); }}
          className={`size-5 rounded-full ${COLOR_META[c].solid} transition hover:scale-110 ${color === c ? 'ring-2 ring-offset-1 ring-[#274E38]' : ''}`}
        />
      ))}
    </div>
  </div>
);

export default CourseColorPicker;
