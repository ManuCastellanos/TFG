import { ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Surface } from '@/components/ui/surface/Surface';
import { Text } from '@/components/ui/text/Text';
import { cn } from '@/shared/utils/cn';
import type { CourseModule } from '@/modules/course/domain/CourseSection';
import { INTERNAL_MODULE_NAMES } from '../../utils/workspace-mappers';

const TYPE_LABEL: Record<string, string> = {
  quiz: 'Cuestionario',
  assign: 'Tarea',
  lesson: 'Lección',
  h5pactivity: 'Actividad H5P',
  workshop: 'Taller',
};

const TYPE_ACCENT: Record<string, string> = {
  quiz: 'from-[var(--course-yellow-from)] to-[var(--course-orange-to)]',
  assign: 'from-[var(--course-blue-from)] to-[var(--course-indigo-to)]',
  lesson: 'from-[var(--course-teal-from)] to-[var(--course-teal-to)]',
  h5pactivity: 'from-[var(--course-pink-from)] to-[var(--course-pink-to)]',
  workshop: 'from-[var(--course-violet-from)] to-[var(--course-purple-to)]',
};

const typeLabel = (type: string) => TYPE_LABEL[type] ?? 'Ejercicio';
const typeAccent = (type: string) =>
  TYPE_ACCENT[type] ?? 'from-[var(--course-emerald-from)] to-[var(--course-emerald-to)]';

const ExerciseCard = ({
  module,
  icon: Icon,
  onExerciseClick,
}: {
  module: CourseModule;
  icon: LucideIcon;
  onExerciseClick?: (module: CourseModule) => void;
}) => {
  const usesInternalPage = INTERNAL_MODULE_NAMES.includes(module.modName);
  const interactive = usesInternalPage || Boolean(module.url);

  const inner = (
    <Surface
      className={cn(
        'group flex items-center gap-4 border border-(--border) p-4',
        interactive && 'transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-md)',
      )}
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-(--shadow-sm)',
          typeAccent(module.modName),
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>

      <span className="flex flex-1 flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-(--fg-subtle)">
          {typeLabel(module.modName)}
        </span>
        <span className="text-base font-bold text-(--fg)">{module.name}</span>
      </span>
    </Surface>
  );

  if (usesInternalPage) {
    return (
      <button
        type="button"
        onClick={() => onExerciseClick?.(module)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-strong) rounded-2xl"
      >
        {inner}
      </button>
    );
  }

  return interactive ? (
    <a
      href={module.url ?? undefined}
      target="_blank"
      rel="noreferrer"
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-strong) rounded-2xl"
    >
      {inner}
    </a>
  ) : (
    inner
  );
};

export type TaskViewProps = {
  exercises: CourseModule[];
  onExerciseClick?: (module: CourseModule) => void;
};

export const TaskView = ({ exercises: tasks, onExerciseClick }: TaskViewProps) => {
  if (tasks.length === 0) {
    return <Text className="text-(--fg-subtle)">Este curso aún no tiene ejercicios disponibles.</Text>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((exercise) => (
        <li key={exercise.id}>
          <ExerciseCard module={exercise} icon={ClipboardList} onExerciseClick={onExerciseClick} />
        </li>
      ))}
    </ul>
  );
};
