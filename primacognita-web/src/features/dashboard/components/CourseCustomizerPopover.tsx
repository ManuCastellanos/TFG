import { COLOR_META, COURSE_COLORS, COURSE_EMOJIS } from '@/shared/hooks/useCourseCustomization';

type CourseCustomizerPopoverProps = {
  emoji: string;
  color: string;
  onEmojiChange: (e: string) => void;
  onColorChange: (c: string) => void;
  onClose: () => void;
};

const CourseCustomizerPopover = ({
  emoji,
  color,
  onEmojiChange,
  onColorChange,
  onClose,
}: CourseCustomizerPopoverProps) => (
  <div
    className="absolute top-12 right-2 z-30 bg-white rounded-2xl p-3 shadow-2xl border border-(--border) w-52"
    onClick={(e) => e.stopPropagation()}
  >
    <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-2">Emoji</p>
    <div className="grid grid-cols-6 gap-1 mb-3">
      {COURSE_EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            onEmojiChange(e);
            onClose();
          }}
          className={`text-lg p-1 rounded-xl transition hover:bg-(--tint-100) ${emoji === e ? 'bg-(--tint-100)' : ''}`}
        >
          {e}
        </button>
      ))}
    </div>
    <p className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle) mb-2">Color</p>
    <div className="flex flex-wrap gap-2">
      {COURSE_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={(ev) => {
            ev.stopPropagation();
            onColorChange(c);
          }}
          className={`size-5 rounded-full ${COLOR_META[c].solid} transition hover:scale-110 ${color === c ? 'ring-2 ring-offset-1 ring-[#274E38]' : ''}`}
        />
      ))}
    </div>
  </div>
);

export default CourseCustomizerPopover;
