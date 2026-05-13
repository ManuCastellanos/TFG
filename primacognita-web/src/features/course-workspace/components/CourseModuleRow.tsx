import { useState, useRef, useEffect } from 'react';
import type { ModuleViewModel } from '../utils/workspace-mappers';

type CourseModuleRowProps = {
  module: ModuleViewModel;
  onClick?: () => void;
  onToggle?: () => void;
};

function usePopAnimation(active: boolean) {
  const prev = useRef(active);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (!prev.current && active) {
      prev.current = true;
      const show = setTimeout(() => setPopping(true), 0);
      const hide = setTimeout(() => setPopping(false), 400);
      return () => {
        clearTimeout(show);
        clearTimeout(hide);
      };
    }
    prev.current = active;
  }, [active]);

  return popping;
}

const CourseModuleRow = ({ module, onClick, onToggle }: CourseModuleRowProps) => {
  const popping = usePopAnimation(module.status === 'completed');

  const containerClasses =
    'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-sm transition';

  const iconAndText = (
    <>
      <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${module.soft}`}>
        <span>{module.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-(--fg) text-[15px] truncate">{module.title}</div>
        <div className={`text-xs font-bold ${module.text}`}>{module.label}</div>
      </div>
    </>
  );

  const teacherBadge =
    module.pendingCount !== undefined ? (
      module.pendingCount > 0 ? (
        <span className="text-xs font-extrabold bg-orange-100 text-orange-700 rounded-lg px-2 py-1 shrink-0">
          {module.pendingCount} por revisar
        </span>
      ) : (
        <span className="text-xs font-bold text-(--fg-subtle) shrink-0">Sin pendientes</span>
      )
    ) : null;

  const isCompleted = module.status === 'completed';

  const completionBtn = module.showCompletion ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
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

  const right = teacherBadge ?? completionBtn;

  if (module.isInternal && onClick) {
    return (
      <div className={containerClasses}>
        <button type="button" onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0 text-left">
          {iconAndText}
        </button>
        {right}
      </div>
    );
  }

  if (module.url) {
    return (
      <div className={containerClasses}>
        <a href={module.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 flex-1 min-w-0">
          {iconAndText}
        </a>
        {right}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {iconAndText}
      {right}
    </div>
  );
};

export default CourseModuleRow;
