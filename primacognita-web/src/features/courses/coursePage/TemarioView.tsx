import { Surface } from '@/components/surface/Surface';
import { Text } from '@/components/text/Text';
import { cn } from '@/shared/utils/cn';
import type { CourseModule, CourseSection } from '@/modules/course/domain/CourseSection';
import ProgressBar from '@/components/progressBar/ProgressBar';
import type { ProgressBarViewModel } from '@/components/progressBar/progressBar.types';

const ModuleRow = ({ module }: { module: CourseModule }) => {
  const interactive = Boolean(module.url);

  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-(--fg-muted)"></span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-semibold text-(--fg)">{module.name}</span>
        <span className="text-xs text-(--fg-subtle) capitalize">{module.modName}</span>
      </span>
    </>
  );

  return interactive ? (
    <a
      href={module.url ?? undefined}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) px-3 py-2.5',
        'transition-colors hover:bg-(--surface-muted)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-strong)',
      )}
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--surface) px-3 py-2.5">
      {content}
    </div>
  );
};

const SectionCard = ({ section }: { section: CourseSection }) => (
  <Surface className="flex flex-col gap-4 border border-(--border) p-5">
    <div className="flex items-baseline gap-3">
      <h3 className="text-lg font-extrabold text-(--fg)">{section.name}</h3>
    </div>

    {section.modules.length === 0 ? (
      <Text className="text-(--fg-subtle)">Aún no hay contenido en este tema.</Text>
    ) : (
      <ul className="flex flex-col gap-2">
        {section.modules.map((module) => (
          <li key={module.id}>
            <ModuleRow module={module} />
          </li>
        ))}
      </ul>
    )}
  </Surface>
);

export type TemarioViewProps = {
  sections: CourseSection[];
  progressViewModel?: ProgressBarViewModel;
};

export const TemarioView = ({ sections, progressViewModel }: TemarioViewProps) => {
  if (sections.length === 0) {
    return <Text className="text-(--fg-subtle)">Este curso aún no tiene temas.</Text>;
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
      {progressViewModel && <ProgressBar viewModel={progressViewModel} />}
    </div>
  );
};
