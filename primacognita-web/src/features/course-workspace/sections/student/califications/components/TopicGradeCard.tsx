import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getModuleMeta } from '@/features/course-workspace/utils/workspace-mappers';
import { SECTION_COLORS } from '@/features/course-workspace/types/workspace.types';
import type { TopicGrade } from '../types/califications.types';

type TopicGradeCardProps = {
  topic: TopicGrade;
  defaultOpen?: boolean;
  onExerciseClick?: (cmid: number, modName: string) => void;
};

export const TopicGradeCard = ({ topic, defaultOpen = false, onExerciseClick }: TopicGradeCardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const color = SECTION_COLORS[(topic.sectionNumber - 1) % SECTION_COLORS.length];

  const hasAvg = topic.averageScore != null;
  const displayAvg = hasAvg ? topic.averageScore!.toFixed(1).replace('.', ',') : '—';

  return (
    <div className="rounded-2xl border border-(--border) bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 text-left transition hover:bg-(--tint-50)"
      >
        <div className={`size-11 rounded-2xl bg-gradient-to-br ${color.grad} grid place-items-center text-white font-extrabold text-sm shrink-0`}>
          T{topic.sectionNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-sm text-(--fg) truncate">{topic.sectionName}</div>
          <div className="text-xs text-(--fg-muted)">
            {topic.completedItems} de {topic.totalItems} ejercicios
          </div>
          {hasAvg && (
            <div className="h-1.5 mt-1.5 bg-(--tint-50) rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${color.grad} rounded-full`} style={{ width: `${(topic.averageScore! / 10) * 100}%` }} />
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          {hasAvg ? (
            <>
              <div className="text-xl font-extrabold text-(--fg) leading-none">{displayAvg}</div>
              <div className="text-[10px] font-bold uppercase text-(--fg-subtle) mt-0.5">/ 10</div>
            </>
          ) : (
            <span className="text-xs font-bold text-(--fg-subtle)">—</span>
          )}
        </div>
        <ChevronDown className={`size-5 text-(--fg-muted) transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[999px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-(--border) mx-4" />
        <div className="px-4 py-2 flex flex-col gap-1">
          {topic.exercises.map((ex) => {
            const meta = getModuleMeta(ex.kind);
            const hasScore = ex.score != null;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => onExerciseClick?.(ex.cmid, ex.modName)}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-(--tint-50) transition text-left"
              >
                <span className={`size-7 rounded-lg grid place-items-center text-xs ${meta.soft}`}>
                  {meta.emoji}
                </span>
                <span className="flex-1 text-sm font-bold text-(--fg) truncate">{ex.title}</span>
                {hasScore ? (
                  <span className="text-sm font-extrabold text-(--fg)">
                    {ex.score!.toFixed(1).replace('.', ',')}
                    <span className="text-xs text-(--fg-muted) font-bold"> / {ex.max}</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-(--fg-subtle)">Pendiente</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
