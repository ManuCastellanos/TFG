import type { CourseModule } from '@/modules/course/domain/CourseSection';
import { getModuleMeta } from '../types/workspace.types';

type CourseModuleRowProps = {
  module: CourseModule;
  onModuleClick?: (module: CourseModule) => void;
};

const INTERNAL_MODULE_NAMES = ['assign', 'quiz'];

const baseContainerClasses =
  'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border border-(--border) bg-white hover:border-emerald-300 hover:shadow-sm transition';

const CourseModuleRow = ({ module, onModuleClick }: CourseModuleRowProps) => {
  const moduleMeta = getModuleMeta(module.modName);

  const isInternalModule = INTERNAL_MODULE_NAMES.includes(module.modName);

  const handleClick = () => {
    onModuleClick?.(module);
  };

  const moduleContent = (
    <>
      <div className={`size-10 rounded-xl grid place-items-center text-lg shrink-0 ${moduleMeta.soft}`}>
        <span>{moduleMeta.emoji}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-bold text-(--fg) text-[15px] truncate">{module.name}</div>

        <div className={`text-xs font-bold ${moduleMeta.text}`}>{moduleMeta.label}</div>
      </div>

      <div className="size-8 rounded-full bg-(--tint-100) grid place-items-center text-(--fg-muted) shrink-0">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </>
  );

  if (isInternalModule) {
    return (
      <button type="button" onClick={handleClick} className={`${baseContainerClasses} text-left`}>
        {moduleContent}
      </button>
    );
  }

  if (module.url) {
    return (
      <a href={module.url} target="_blank" rel="noreferrer" className={baseContainerClasses}>
        {moduleContent}
      </a>
    );
  }

  return <div className={baseContainerClasses}>{moduleContent}</div>;
};

export default CourseModuleRow;
