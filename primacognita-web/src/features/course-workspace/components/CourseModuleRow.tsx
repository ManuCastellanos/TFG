import { useState, useRef, useEffect } from 'react';
import type { CourseModule } from '@/modules/course/domain/CourseSection';
import { getModuleMeta } from '../types/workspace.types';

type CourseModuleRowProps = {
  module: CourseModule;
  onModuleClick?: (module: CourseModule) => void;
  onToggleComplete?: (module: CourseModule) => void;
};

const INTERNAL_MODULE_NAMES = ['assign', 'quiz'];

const CourseModuleRow = ({ module, onModuleClick, onToggleComplete }: CourseModuleRowProps) => {
  const moduleMeta = getModuleMeta(module.modName);
  const isInternalModule = INTERNAL_MODULE_NAMES.includes(module.modName);

  const showCompletion = module.completion?.hasCompletion === true;
  const isCompleted = (module.completion?.state ?? 0) >= 1;

  // Pop animation when transitioning to completed
  const prevCompleted = useRef(isCompleted);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (!prevCompleted.current && isCompleted) {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 400);
      prevCompleted.current = true;
      return () => clearTimeout(t);
    }
    prevCompleted.current = isCompleted;
  }, [isCompleted]);

  const containerClasses = 'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-sm transition';

  const iconAndText = (
    <>
      <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${moduleMeta.soft}`}>
        <span>{moduleMeta.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-(--fg) text-[15px] truncate">{module.name}</div>
        <div className={`text-xs font-bold ${moduleMeta.text}`}>{moduleMeta.label}</div>
      </div>
    </>
  );

  const completionBtn = showCompletion ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggleComplete?.(module); }}
      aria-label={isCompleted ? 'Marcar como no hecha' : 'Marcar como hecha'}
      className={[
        'size-8 rounded-full grid place-items-center shrink-0',
        isCompleted
          ? `bg-emerald-100 border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-200 ${
              popping ? 'scale-125 transition-none' : 'scale-100 transition-transform duration-300'
            }`
          : 'bg-white border-2 border-(--border) text-(--fg-muted) hover:border-emerald-300 hover:text-emerald-600 transition-colors',
      ].join(' ')}
    >
      {isCompleted ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  ) : (
    <div className="size-8 rounded-full bg-(--tint-100) grid place-items-center text-(--fg-muted) shrink-0">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );

  if (isInternalModule) {
    return (
      <div className={containerClasses}>
        <button
          type="button"
          onClick={() => onModuleClick?.(module)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
        >
          {iconAndText}
        </button>
        {completionBtn}
      </div>
    );
  }

  if (module.url) {
    return (
      <div className={containerClasses}>
        <a href={module.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1 min-w-0">
          {iconAndText}
        </a>
        {completionBtn}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {iconAndText}
      {completionBtn}
    </div>
  );
};

export default CourseModuleRow;
