import { getModuleMeta } from "@/features/course-workspace/utils/workspace-mappers";
import { STATE_META } from "../utils/stateMeta";
import { formatDueDate } from "../utils/formatDueDate";
import type { EnrichedExercise } from "../types/exercise.types";

type ExerciseRowProps = {
  exercise: EnrichedExercise;
  now: number;
  onClick?: () => void;
};

export const ExerciseRow = ({ exercise, now, onClick }: ExerciseRowProps) => {
  const meta = getModuleMeta(exercise.kind);
  const s = STATE_META[exercise.state];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-(--border) hover:border-emerald-300 hover:shadow-sm transition text-left"
    >
      <div className={`size-12 rounded-2xl ${meta.soft} grid place-items-center text-2xl shrink-0`}>
        {meta.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--fg-subtle)">
            {meta.label}
          </span>
          <span className="text-(--fg-subtle)">·</span>
          <span className="text-[11px] font-bold text-(--fg-muted)">
            {exercise.topic}
          </span>
        </div>
        <div className="font-extrabold text-(--fg) leading-tight truncate">
          {exercise.title}
        </div>
        <div className="text-xs text-(--fg-muted) mt-0.5">
          📅 Cierre: <span className="font-bold">{formatDueDate(exercise.dueTimestamp, now)}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span className={`text-[10px] font-extrabold rounded-full px-2.5 py-1 flex items-center gap-1 ${s.pill}`}>
          <span>{s.icon}</span>{s.label}
        </span>
        {exercise.score != null && (
          <span className="text-sm font-extrabold text-(--fg)">
            {exercise.score}
            <span className="text-xs text-(--fg-muted) font-bold"> / {exercise.max}</span>
          </span>
        )}
      </div>
    </button>
  );
};
